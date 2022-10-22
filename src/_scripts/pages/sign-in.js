(function () {

    const SUBMIT_TIMEOUT = 4000;
    const SUBMIT_MIN_ERROR_WAIT = 1000;
    const SUBMIT_MIN_SUCCESS_WAIT = 800;
    const PREVIOUS_LOGINS_STORAGE_KEY = 'previous-logins';

    const schoolUrl = schoolName => `https://${schoolName}.learnpoint.se`;
    const schoolPingUrl = schoolName => `https://${schoolName}.learnpoint.se/ValidLearnpointSchool.aspx`;

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

        if (logins.includes(schoolUrl)) {
            return;
        }

        logins.push(schoolUrl);

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

        ul.innerHTML = previousLogins.map(url => `
            <li class="sign-in__previous-login-item" data-element="sign-in__previous-login-item">
                <a href="${url}">
                    <span>${url.replace('https://', '')}</span>
                </a>
                <button class="sign-in__previous-login-delete-button" data-element="sign-in__previous-login-delete-button" title="Remove">
                    <img src="/_images/icons/trash.svg" alt="Remove" />
                </button>
                <div class="sign-in__previous-login-delete-confirm-popover">
                    <button class="sign-in__previous-login-confirm-delete" 
                            data-element="sign-in__previous-login-confirm-delete"
                            data-url="${url}">
                        <span lang="en">Remove</span>
                        <span lang="sv">Ta bort</span>
                    </button>
                    <button class="sign-in__previous-login-cancel-delete"
                            data-element="sign-in__previous-login-cancel-delete">
                        <span lang="en">Cancel</span>
                        <span lang="sv">Avbryt</span>
                    </button>
                </div>
            </li>`).join('');

        el.previousLogins.append(ul);

        el.previousLogins.classList.remove('EMPTY');
    }

    document.addEventListener('click', event => {

        // A. Open Popover
        if (event.target.closest('[data-element="sign-in__previous-login-delete-button"]')) {
            const previousLoginItem = event.target.closest('[data-element="sign-in__previous-login-item"]');
            if (!previousLoginItem) {
                return;
            }

            previousLoginItem.classList.add('POPOVER-OPEN');
            return;
        }

        // B. Delete Previous Login
        if (event.target.closest('[data-element="sign-in__previous-login-confirm-delete"]')) {
            const confirmDeleteBtn = event.target.closest('[data-element="sign-in__previous-login-confirm-delete"]');
            const schoolUrl = confirmDeleteBtn.getAttribute('data-url');
            if (!schoolUrl) {
                return;
            }

            removePreviousLogin(schoolUrl);
            renderPreviousLogins();
            return;
        }

        // C. Close Popovers
        closeDeletePreviousLoginPopovers();
    });

    document.addEventListener('keyup', event => {
        if (event.key === 'Escape') {
            closeDeletePreviousLoginPopovers();
        }
    });

    function closeDeletePreviousLoginPopovers() {
        const openPopovers = document.querySelectorAll('[data-element="sign-in__previous-login-item"].POPOVER-OPEN');
        openPopovers.forEach(popover => popover.classList.remove('POPOVER-OPEN'));
    }

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

        // Clean input
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
