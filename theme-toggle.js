// Add this JavaScript to enable theme switching
document.addEventListener('DOMContentLoaded', function() {
    // Create theme toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle light/dark theme');
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.className = savedTheme;
    } else {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.body.className = 'theme-light';
      } else {
        document.body.className = 'theme-dark';
      }
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
      if (document.body.className === 'theme-dark') {
        document.body.className = 'theme-light';
        localStorage.setItem('theme', 'theme-light');
      } else {
        document.body.className = 'theme-dark';
        localStorage.setItem('theme', 'theme-dark');
      }
    });
  });