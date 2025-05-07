// Add this JavaScript to your existing script file or in a new script

document.addEventListener('DOMContentLoaded', () => {
    // Theme toggle functionality
    setupThemeToggle();
    
    // Your existing code...
});

function setupThemeToggle() {
    // Create the theme toggle elements
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    
    const label = document.createElement('label');
    label.className = 'switch';
    
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = 'theme-switch';
    
    const slider = document.createElement('span');
    slider.className = 'slider';
    
    // Append elements
    label.appendChild(input);
    label.appendChild(slider);
    themeToggle.appendChild(label);
    
    // Append to the container
    document.querySelector('.container').appendChild(themeToggle);
    
    // Get stored theme preference or use system preference
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const storedTheme = localStorage.getItem("theme");
    
    if (storedTheme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        input.checked = true;
    } else if (storedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        input.checked = false;
    } else if (prefersDarkScheme.matches) {
        document.documentElement.setAttribute("data-theme", "dark");
        input.checked = false;
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        input.checked = true;
    }
    
    // Add event listener for the toggle
    input.addEventListener("change", function() {
        if (this.checked) {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        }
    });
    
    // Add media query listener for system theme changes
    prefersDarkScheme.addEventListener("change", function(e) {
        // Only auto-switch if user hasn't manually set a preference
        if (!localStorage.getItem("theme")) {
            if (e.matches) {
                document.documentElement.setAttribute("data-theme", "dark");
                input.checked = false;
            } else {
                document.documentElement.setAttribute("data-theme", "light");
                input.checked = true;
            }
        }
    });
}