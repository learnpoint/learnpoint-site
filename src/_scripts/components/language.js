(function () {
    const key = 'selected-language';

    if (!getLanguage()) {
        if (navigator.language && navigator.language.startsWith('en')) {
            localStorage.setItem(key, 'en');
        } else {
            localStorage.setItem(key, 'sv');
        }
    }

    setLanguage(localStorage.getItem(key));

    function setLanguage(language) {
        localStorage.setItem(key, language);
        document.documentElement.lang = language;
        document.documentElement.setAttribute('lang', language);
    }

    function getLanguage() {
        return localStorage.getItem(key);
    }

    document.addEventListener('click', event => {
        if (!event.target.matches('[data-select-language]')) {
            return;
        }

        const currentLanguage = getLanguage();
        const selectedLanguage = event.target.getAttribute('data-select-language');
        if (currentLanguage === selectedLanguage) {
            return;
        }

        setLanguage(event.target.getAttribute('data-select-language'));
        // window.scrollTo(0, 0);
    });
})();
