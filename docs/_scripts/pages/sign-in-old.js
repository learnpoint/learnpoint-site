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
                    <svg viewBox="0 0 16 16" width="16" height="16">
                        <path fill-rule="evenodd" fill="currentColor" d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 00-1.492-.149l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z"></path>
                    </svg>
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
