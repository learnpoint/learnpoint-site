(function () {

    let formElement;
    let inputElement;
    let inputOverlayElement;
    let submitElement;

    document.addEventListener('DOMContentLoaded', event => {
        formElement = document.querySelector('[data-element="sign-in__form"]');
        inputElement = document.querySelector('[data-element="sign-in__input"]');
        inputOverlayElement = document.querySelector('[data-element="sign-in__input-overlay"]');
        submitElement = document.querySelector('[data-element="sign-in__submit"]');
        updateInput();
    });

    document.addEventListener('submit', event => {
        if (event.target !== formElement) {
            return;
        }

        event.preventDefault();

        formElement.classList.add('SUBMITTING');

        isSchoolNameValid(inputElement.value, error, success);
    });

    function error() {
        formElement.classList.remove('SUBMITTING');
        formElement.classList.add('ERROR');
        inputElement.classList.add('ERROR');
    }

    function success(url) {
        formElement.classList.remove('SUBMITTING');
        formElement.classList.remove('ERROR');

        let schools = [];

        if (localStorage.getItem('schools')) {
            schools = JSON.parse(localStorage.getItem('schools'));
        }

        if (!schools.includes(url)) {
            schools.push(url);
        }

        localStorage.setItem('schools', JSON.stringify(schools));

        location.href = url;
    }

    document.addEventListener('input', event => {
        if (event.target !== inputElement) {
            return;
        }

        updateInput();
    });

    function updateInput() {
        inputElement.classList.remove('ERROR');

        if (inputElement.value) {
            formElement.classList.add('HAS-VALUE');
        } else {
            formElement.classList.remove('HAS-VALUE');
        }

        let hostName = inputElement.value;

        if (!hostName) {
            hostName = inputElement.placeholder;
        }

        inputOverlayElement.textContent = hostName;
    }

    function isSchoolNameValid(name, error, success) {
        const schoolUrl = `https://${name}.learnpoint.se/Images/learnpoint.ico`;
        const img = new Image();
        img.onload = () => success(`https://${name}.learnpoint.se`);
        img.onerror = () => error();
        img.src = schoolUrl;
    }

    window.addEventListener('popstate', event => {
        console.log('popstate');
    });

    window.addEventListener('hashchange', event => {
        console.log('haschange');
    });

})();
