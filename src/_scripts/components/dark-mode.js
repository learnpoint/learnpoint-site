(function () {


    const STORAGE_KEY = 'dark-mode';
    const CSS_DARK_MODE = 'dark';
    const CSS_LIGHT_MODE = 'light';

    const TOGGLE_BUTTON_SELECTOR = '.footer__dark-mode-toggle-button';



    /* =====================================================================
       Init
       ===================================================================== */

    setDarkMode(isDarkMode());



    /* =====================================================================
       Low Level Dark Mode
       ===================================================================== */

    function systemDarkMode() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function savedDarkMode() {
        if (localStorage.getItem(STORAGE_KEY) === null) {
            return null;
        }

        return localStorage.getItem(STORAGE_KEY) === 'true';
    }



    /* =====================================================================
       Is Dark Mode
       ===================================================================== */

    function isDarkMode() {
        if (savedDarkMode() !== null) {
            return savedDarkMode();
        } else {
            return systemDarkMode();
        }
    }



    /* =====================================================================
       Set Dark Mode
       ===================================================================== */

    function setDarkMode(darkMode) {
        document.documentElement.classList.toggle(CSS_DARK_MODE, darkMode);
        document.documentElement.classList.toggle(CSS_LIGHT_MODE, !darkMode);

        if (darkMode === systemDarkMode()) {
            localStorage.removeItem(STORAGE_KEY);
        } else {
            localStorage.setItem(STORAGE_KEY, darkMode ? 'true' : 'false');
        }
    }



    /* =====================================================================
       Toggle Dark Mode
       ===================================================================== */

    const toggleDarkMode = () => setDarkMode(!isDarkMode());

    document.addEventListener('click', event => {
        const toggleButton = event.target.closest(TOGGLE_BUTTON_SELECTOR);
        if (!toggleButton) {
            return;
        }

        toggleDarkMode();
    });

})();