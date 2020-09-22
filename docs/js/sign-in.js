(function () {

    let formElement;
    let inputElement;
    let inputOverlayElement;
    let submitElement;
    let savedSchoolsElement;

    document.addEventListener('DOMContentLoaded', event => {
        formElement = document.querySelector('[data-element="sign-in__form"]');
        inputElement = document.querySelector('[data-element="sign-in__input"]');
        inputOverlayElement = document.querySelector('[data-element="sign-in__input-overlay"]');
        submitElement = document.querySelector('[data-element="sign-in__submit"]');
        savedSchoolsElement = document.querySelector('[data-element="sign-in__saved-schools"]');
        populateSavedSchoolsList();
    });

    function populateSavedSchoolsList() {
        const savedSchools = getSavedSchools();
        if (!savedSchools.length) {
            return;
        }

        const ul = document.createElement('ul');

        savedSchools.forEach((url, i) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            const removeIcon = document.createElement("img");
            removeIcon.src = "/img/icons/remove.png";
            removeIcon.id = i;
            removeIcon.setAttribute('title', 'Remove this sign in');
            removeIcon.addEventListener('click', e => {
                let linkToBeRemoved = e.target.id;
                li.classList.add('REMOVED');
                deleteLink(parseInt(linkToBeRemoved));
            })

            a.href = url;
            a.textContent = url.replace('https://', '');
            li.append(a);
            li.append(removeIcon);
            ul.append(li);
        });


        savedSchoolsElement.append(ul);

        savedSchoolsElement.classList.remove('EMPTY');
    }


    function deleteLink(linkToBeDeleted) {

        const savedSchools = getSavedSchools();
        if (!savedSchools.length) {
            return;
        }

        savedSchools.forEach((url, id) => {
            if (linkToBeDeleted === id) {
                savedSchools.splice(linkToBeDeleted, 1);
            }
        })

        localStorage.setItem('saved-schools', JSON.stringify(savedSchools));

        if (!savedSchools.length) {
            savedSchoolsElement.classList.add('EMPTY');
        }

    }

    function saveSchool(url) {
        let schools = getSavedSchools();

        if (!schools.includes(url)) {
            schools.push(url);
        }

        schools.sort();

        localStorage.setItem('saved-schools', JSON.stringify(schools));
    }

    function getSavedSchools() {
        if (!localStorage.getItem('saved-schools')) {
            return [];
        }
        return JSON.parse(localStorage.getItem('saved-schools'));
    }

    document.addEventListener('submit', event => {
        if (event.target !== formElement) {
            return;
        }

        event.preventDefault();

        formElement.classList.add('SUBMITTING');
        formElement.classList.remove('ERROR');

        const submitStartTime = Date.now();

        isSchoolNameValid(inputElement.value, function () {
            // Ensure a minimum delay of 1000ms
            let wait = Math.max(1000 - (Date.now() - submitStartTime), 0);
            setTimeout(error, wait);
        }, function (url) {
            // Ensure a minimum delay of 800ms
            let wait = Math.max(800 - (Date.now() - submitStartTime), 0);
            setTimeout(() => success(url), wait);
        });
    });

    function error() {
        formElement.classList.remove('SUBMITTING');
        formElement.classList.add('ERROR');
    }

    function success(url) {
        saveSchool(url);

        formElement.classList.remove('SUBMITTING');
        formElement.classList.remove('ERROR');

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
