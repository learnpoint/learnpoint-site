document.addEventListener('click', event => {
    if (!event.target.matches('[data-select-language]')) {
        return;
    }

    selectLanguage(event.target.getAttribute('data-select-language'));
});

document.addEventListener('DOMContentLoaded', event => {
    if (!sessionStorage.getItem('selected-language')) {
        sessionStorage.setItem('selected-language', 'eng');
    }

    selectLanguage(sessionStorage.getItem('selected-language'));
});

function selectLanguage(language) {
    sessionStorage.setItem('selected-language', language);

    const languageStyle = document.getElementById('language-style');

    if (language === 'sv') {
        languageStyle.innerHTML = '.eng { display: none; } [data-select-language="eng"] { color: #aaa; }';
    } else if (language === 'eng') {
        languageStyle.innerHTML = '.sv { display: none; } [data-select-language="sv"] { color: #aaa; }';
    } else {
        console.error('Language', language, 'not supported');
    }
}