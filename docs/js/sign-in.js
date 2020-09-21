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
    });

    document.addEventListener('submit', event => {
        if (event.target !== formElement) {
            return;
        }

        event.preventDefault();

        formElement.classList.add('SUBMITTING');
        formElement.classList.remove('ERROR');
        inputElement.disabled = true;
        inputElement.setAttribute('disabled', '');

        const submitStartTime = Date.now();

        isSchoolNameValid(inputElement.value, function () {
            let wait = Math.max(1000 - (Date.now() - submitStartTime), 0);
            setTimeout(error, wait);
        }, function (url) {
            let wait = Math.max(800 - (Date.now() - submitStartTime), 0);
            setTimeout(() => success(url), wait);
        });
    });

    function error() {
        formElement.classList.remove('SUBMITTING');
        formElement.classList.add('ERROR');

        inputElement.disabled = false;
        inputElement.removeAttribute('disabled');
        inputElement.focus();
    }

    function success(url) {
        formElement.classList.remove('SUBMITTING');
        formElement.classList.remove('ERROR');

        inputElement.disabled = false;
        inputElement.removeAttribute('disabled');
        inputElement.focus();

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
        if (inputElement.value) {
            formElement.classList.remove('EMPTY');
            submitElement.disabled = false;
            submitElement.removeAttribute('disabled');
        } else {
            formElement.classList.add('EMPTY');
            submitElement.disabled = true;
            submitElement.setAttribute('disabled', '');
        }

        formElement.classList.remove('ERROR');

        let hostName = inputElement.value;

        if (!hostName) {
            hostName = inputElement.placeholder;
        }

        inputOverlayElement.textContent = hostName;
    }

    function isSchoolNameValid(name, error, success) {
        let done = false;

        const img = new Image();

        const timeoutError = setTimeout(() => {
            if (done) return;
            done = true;
            error();
        }, 4000);

        img.onload = () => {
            if (done) return;
            done = true;
            clearTimeout(timeoutError);
            success(`https://${name}.learnpoint.se`);
        };

        img.onerror = () => {
            if (done) return;
            done = true;
            clearTimeout(timeoutError);
            error();
        };

        img.src = `https://${name}.learnpoint.se/Images/learnpoint.ico`;
    }
})();
