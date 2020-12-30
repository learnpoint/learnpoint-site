(function () {
    const key = 'selected-language';

    if (!localStorage.getItem(key)) {
        if (navigator.language && navigator.language.startsWith('en')) {
            localStorage.setItem(key, 'en');
        } else {
            localStorage.setItem(key, 'sv');
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
