(function () {

    const SUBMIT_TIMEOUT = 4000;
    const SUBMIT_MIN_ERROR_WAIT = 1000;
    const SUBMIT_MIN_SUCCESS_WAIT = 800;
    const PREVIOUS_LOGINS_STORAGE_KEY = 'previous-logins';

    const schoolUrl = schoolName => `https://${schoolName}.learnpoint.se`;
    const schoolPingUrl = schoolName => `https://${schoolName}.learnpoint.se/Images/learnpoint.ico`;

    const el = {};

    document.addEventListener('DOMContentLoaded', () => {
        el.form = document.querySelector('[data-element="sign-in__form"]');
        el.input = document.querySelector('[data-element="sign-in__input"]');
        el.inputOverlay = document.querySelector('[data-element="sign-in__input-overlay"]');
        el.previousLogins = document.querySelector('[data-element="sign-in__previous-logins"]');

        for (let prop in el) {
            if (!el[prop]) {
                console.error('Element ' + prop + ' was not found');
                return;
            }
        }

        renderPreviousLogins();
    });

    function getPreviousLogins() {
        if (!localStorage.getItem(PREVIOUS_LOGINS_STORAGE_KEY)) {
            return [];
        }
        return JSON.parse(localStorage.getItem(PREVIOUS_LOGINS_STORAGE_KEY));
    }

    function addPreviousLogin(schoolUrl) {
        let logins = getPreviousLogins();

        if (!logins.includes(schoolUrl)) {
            logins.push(schoolUrl);
        }

        logins.sort();

        localStorage.setItem(PREVIOUS_LOGINS_STORAGE_KEY, JSON.stringify(logins));
    }

    function removePreviousLogin(schoolUrl) {
        localStorage.setItem(PREVIOUS_LOGINS_STORAGE_KEY, JSON.stringify(getPreviousLogins().filter(s => s !== schoolUrl)));
    }

    function renderPreviousLogins() {
        const existingUL = el.previousLogins.querySelector('ul');
        if (existingUL) {
            existingUL.remove();
        }

        const previousLogins = getPreviousLogins();
        if (!previousLogins.length) {
            el.previousLogins.classList.add('EMPTY');
            return;
        };

        const ul = document.createElement('ul');

        previousLogins.forEach(url => {
            const li = document.createElement('li');
            const a = document.createElement('a');

            const removeIcon = document.createElement("img");
            removeIcon.classList.add('sign-in__remove-url-icon')
            const confirmPopover = document.createElement('div');
            confirmPopover.classList.add('sign-in__confirm-popover');
            const deleteButton = document.createElement('button');
            const spanDeleteEng = document.createElement('span');
            const spanDeleteSv = document.createElement('span');
            spanDeleteEng.textContent = "Delete";
            spanDeleteEng.lang = "en"
            spanDeleteSv.textContent = "Ta bort";
            spanDeleteSv.lang = "sv"
            deleteButton.classList.add('sign-in__url-delete-button');
            const cancelButton = document.createElement('button');
            const spanCancelEng = document.createElement('span');
            const spanCancelSv = document.createElement('span');
            spanCancelEng.textContent = "Cancel";
            spanCancelEng.lang = "en"
            spanCancelSv.textContent = "Avbryt";
            spanCancelSv.lang = "sv"
            cancelButton.classList.add('sign-in__url-cancel-button');
            deleteButton.append(spanDeleteEng);
            deleteButton.append(spanDeleteSv);
            cancelButton.append(spanCancelEng);
            cancelButton.append(spanCancelSv);
            confirmPopover.append(deleteButton);
            confirmPopover.append(cancelButton);
            removeIcon.src = "/img/icons/trash-can.png";

            removeIcon.addEventListener('click', e => {
                li.classList.add('POPOVER-OPEN');
            })

            deleteButton.addEventListener('click', e => {
                removePreviousLogin(url);
                renderPreviousLogins();
            })

            cancelButton.addEventListener('click', e => {
                li.classList.remove('POPOVER-OPEN');
            })

            a.href = url;
            a.textContent = url.replace('https://', '');
            li.append(a);
            li.append(removeIcon);
            li.append(confirmPopover);
            ul.append(li);
        });

        el.previousLogins.append(ul);

        el.previousLogins.classList.remove('EMPTY');
    }

    document.addEventListener('click', event => {
        const confirmPopovers = document.querySelectorAll('.sign-in__confirm-popover');
        if (!confirmPopovers.length) {
            return;
        }

        confirmPopovers.forEach(confirmPopover => {
            const listItem = confirmPopover.closest('li');
            const remove = listItem.querySelector('.sign-in__remove-url-icon');
            const cancel = confirmPopover.querySelector('.sign-in__url-cancel-button');
            if (event.target == remove || event.target == cancel) {
                return;
            }
            listItem.classList.remove('POPOVER-OPEN');
        })
    })

    document.addEventListener('keyup', event => {
        if (event.key !== 'Escape') {
            return;
        }

        const confirmPopovers = document.querySelectorAll('.sign-in__confirm-popover');
        if (!confirmPopovers.length) {
            return;
        }

        confirmPopovers.forEach(confirmPopover => {
            const listItem = confirmPopover.closest('li');
            listItem.classList.remove('POPOVER-OPEN');
        })
    });

    document.addEventListener('input', event => {
        if (event.target !== el.input) {
            return;
        }
        updateInput();
    });

    function updateInput() {
        if (el.input.value) {
            el.form.classList.remove('EMPTY');
        } else {
            el.form.classList.add('EMPTY');
        }

        el.form.classList.remove('ERROR');

        let hostName = el.input.value;

        if (!hostName) {
            hostName = el.input.placeholder;
        }

        el.inputOverlay.textContent = hostName;
    }

    document.addEventListener('submit', event => {
        if (event.target !== el.form) {
            return;
        }

        event.preventDefault();

        /* Clean input */
        el.input.value = el.input.value.replace(/[^a-zA-Z0-9-_.]/g, '').toLowerCase();
        updateInput();

        if (el.form.classList.contains('EMPTY')) {
            el.form.classList.add('ERROR');
            el.input.focus();
            return;
        }

        const schoolName = el.input.value;

        el.form.classList.remove('ERROR');
        el.form.classList.add('SUBMITTING');

        const submitStartTime = Date.now();

        validateSchoolName(
            schoolName,
            () => {
                let wait = Math.max(SUBMIT_MIN_SUCCESS_WAIT - (Date.now() - submitStartTime), 0);
                setTimeout(() => submitSuccess(schoolUrl(schoolName)), wait);
            },
            () => {
                let wait = Math.max(SUBMIT_MIN_ERROR_WAIT - (Date.now() - submitStartTime), 0);
                setTimeout(submitError, wait);
            }
        );
    });

    function submitSuccess(schoolUrl) {
        addPreviousLogin(schoolUrl);
        location.href = schoolUrl;
    }

    function submitError() {
        el.form.classList.remove('SUBMITTING');
        el.form.classList.add('ERROR');
        el.input.focus();
    }

    function validateSchoolName(name, success, error) {
        let done = false;

        const img = new Image();

        const timeoutError = setTimeout(() => {
            if (done) return;
            done = true;
            error();
        }, SUBMIT_TIMEOUT);

        img.onload = () => {
            if (done) return;
            done = true;
            clearTimeout(timeoutError);
            success();
        };

        img.onerror = () => {
            if (done) return;
            done = true;
            clearTimeout(timeoutError);
            error();
        };

        img.src = schoolPingUrl(name);
    }

    window.addEventListener('pageshow', e => {
        // Handle bfcache
        if (e.persisted) {
            el.form.classList.remove('SUBMITTING');
            el.input.value = '';
            updateInput();
            renderPreviousLogins();
        }
    });

})();
