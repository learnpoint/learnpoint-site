(function () {

    let formElement;
    let inputElement;
    let inputOverlayElement;
    let savedSchoolsElement;

    document.addEventListener('DOMContentLoaded', event => {
        formElement = document.querySelector('[data-element="sign-in__form"]');
        inputElement = document.querySelector('[data-element="sign-in__input"]');
        inputOverlayElement = document.querySelector('[data-element="sign-in__input-overlay"]');
        savedSchoolsElement = document.querySelector('[data-element="sign-in__saved-schools"]');
        populateSavedSchoolsList();
    });

    function populateSavedSchoolsList() {
        const ulOnPage = savedSchoolsElement.querySelector('ul')
        if (ulOnPage) {
            ulOnPage.remove();
        }

        const savedSchools = getSavedSchools();
        if (!savedSchools.length) {
            savedSchoolsElement.classList.add('EMPTY');
            return;
        };

        const ul = document.createElement('ul');

        savedSchools.forEach(url => {
            const li = document.createElement('li');
            const a = document.createElement('a');

            const removeIcon = document.createElement("img");
            const confirmPopover = document.createElement('div');
            confirmPopover.classList.add('sign-in__confirm-popover');
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = "Delete";
            deleteButton.classList.add('sign-in__url-delete-button');
            const cancelButton = document.createElement('button');
            cancelButton.innerHTML = "Cancel";
            cancelButton.classList.add('sign-in__url-cancel-button');
            confirmPopover.append(deleteButton);
            confirmPopover.append(cancelButton);
            removeIcon.src = "/img/icons/trash-can.png";

            removeIcon.addEventListener('click', e => {
                confirmPopover.classList.add('OPEN');
            })

            deleteButton.addEventListener('click', e => {
                removeSavedSchool(url);
                populateSavedSchoolsList();
            })

            cancelButton.addEventListener('click', e => {
                confirmPopover.classList.remove('OPEN');
            })

            a.href = url;
            a.textContent = url.replace('https://', '');
            li.append(a);
            li.append(removeIcon);
            li.append(confirmPopover);
            ul.append(li);
        });


        savedSchoolsElement.append(ul);

        savedSchoolsElement.classList.remove('EMPTY');
    }

    function removeSavedSchool(schoolUrl) {
        localStorage.setItem('saved-schools', JSON.stringify(getSavedSchools().filter(s => s !== schoolUrl)));
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

        if (formElement.classList.contains('EMPTY')) {
            inputElement.focus();
            formElement.classList.add('ERROR');
            return;
        }

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
        } else {
            formElement.classList.add('EMPTY');
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
