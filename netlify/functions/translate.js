// netlify/functions/translate.js - Updated to support batched translations
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the request body
    const requestBody = JSON.parse(event.body);
    
    // Check if it's a single text or batch request
    if (requestBody.texts && Array.isArray(requestBody.texts)) {
      // Batch translation
      return await handleBatchTranslation(requestBody);
    } else {
      // Single text translation (for backward compatibility)
      return await handleSingleTranslation(requestBody);
    }
  } catch (error) {
    console.error('Translation error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to translate: ' + error.message })
    };
  }
};

// Handle single text translation (legacy support)
async function handleSingleTranslation(params) {
  const { text, source, target } = params;
  
  if (!text || !target) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing required parameters' })
    };
  }
  
  // Translate single text
  const translatedText = await translateText(text, source || 'auto', target);
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    },
    body: JSON.stringify({ 
      translatedText,
      source: source || 'auto',
      target
    })
  };
}

// Handle batch translation (new optimized approach)
async function handleBatchTranslation(params) {
  const { texts, source, target } = params;
  
  if (!texts || !Array.isArray(texts) || !target) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing or invalid required parameters' })
    };
  }
  
  // Filter out empty texts
  const validTexts = texts.filter(text => text && text.trim().length > 0);
  
  if (validTexts.length === 0) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        translatedTexts: [],
        source: source || 'auto',
        target
      })
    };
  }
  
  try {
    // OPTIMIZATION: Split into smaller batches if needed
    // Google Translate API has URL length limitations
    const batchSize = 20; // Adjust based on your testing
    const batches = [];
    
    for (let i = 0; i < validTexts.length; i += batchSize) {
      batches.push(validTexts.slice(i, i + batchSize));
    }
    
    // Process each batch
    const batchResults = await Promise.all(
      batches.map(batch => translateBatch(batch, source || 'auto', target))
    );
    
    // Combine results
    const translatedTexts = batchResults.flat();
    
    // Ensure the result array matches the original input array
    const finalResults = texts.map(text => {
      if (!text || text.trim().length === 0) return text;
      const index = validTexts.indexOf(text);
      return index >= 0 ? translatedTexts[index] : text;
    });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        translatedTexts: finalResults,
        source: source || 'auto',
        target
      })
    };
  } catch (error) {
    console.error('Batch translation error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to translate batch: ' + error.message })
    };
  }
}

// Translate a batch of texts in a single request
async function translateBatch(texts, sourceLang, targetLang) {
  if (texts.length === 0) return [];
  
  // Our efficient approach: Join texts with a special delimiter
  // then split the translation result
  // Use a delimiter that's unlikely to appear in regular text
  const delimiter = ' [|||] ';
  const combinedText = texts.join(delimiter);
  
  try {
    const translatedCombined = await translateText(combinedText, sourceLang, targetLang);
    
    // Split the result back into individual texts
    // In rare cases when the translation engine doesn't preserve our delimiter
    // exactly, we'll do our best to reconstruct
    
    if (!translatedCombined.includes(delimiter)) {
      // If delimiter is lost, we'll need to translate one by one as fallback
      console.log('Delimiter not preserved, falling back to individual translations');
      return Promise.all(texts.map(text => translateText(text, sourceLang, targetLang)));
    }
    
    return translatedCombined.split(delimiter);
  } catch (error) {
    console.error('Batch translation error:', error);
    
    // Fallback to individual translations
    console.log('Falling back to individual translations due to error');
    return Promise.all(texts.map(text => translateText(text, sourceLang, targetLang)));
  }
}

// Function to translate a single text
async function translateText(text, sourceLang, targetLang) {
  // URL encode the text
  const encodedText = encodeURIComponent(text);
  
  // Use Google Translate's free endpoint
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodedText}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Translation API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Extract the translated text
    let translatedText = '';
    if (data && data[0]) {
      data[0].forEach(item => {
        if (item[0]) {
          translatedText += item[0];
        }
      });
    }
    
    return translatedText;
  } catch (error) {
    console.error(`Error translating text: "${text.substring(0, 30)}..."`, error);
    // Return original text on error as fallback
    return text;
  }
}