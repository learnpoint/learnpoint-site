(function () {
    // We need to init language before document
    // is loaded. We cannot wait for DOMContentLoaded
    // because that would cause text flicker.
    // We support 'en' (default) and 'sv'.

    const key = 'selected-language';

    if (localStorage.getItem(key) === null) {
        if (['sv', 'swe', 'sv-SE'].includes(navigator.language)) {
            localStorage.setItem(key, 'sv');
        } else {
            localStorage.setItem(key, 'en');
        }
    }

    selectLanguage(localStorage.getItem(key));

    function selectLanguage(language) {
        localStorage.setItem(key, language);
        document.documentElement.lang = language;
        document.documentElement.setAttribute('lang', language);
    }

    document.addEventListener('click', event => {
        if (!event.target.matches('[data-select-language]')) {
            return;
        }

        selectLanguage(event.target.getAttribute('data-select-language'));
    });
})();
