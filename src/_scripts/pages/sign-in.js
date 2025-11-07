(function () {

    const PREVIOUS_LOGINS_STORAGE_KEY = 'previous-logins';

    const Selector = {
        SEARCH_INPUT: '[data-element="sign-in__search-input"]',
        SEARCH_RESULT: '[data-element="sign-in__search-result"]',
        SEARCH_RESULT_LINK: '[data-element="sign-in__search-result"] a',
        PREVIOUS_LOGINS: '[data-element="sign-in__previous-logins"]'
    }

    const el = {};

    let schools;



    /* =====================================================================
       DOMContentLoaded
       ===================================================================== */

    document.addEventListener('DOMContentLoaded', async event => {
        el.searchInput = document.querySelector(Selector.SEARCH_INPUT);
        el.searchResult = document.querySelector(Selector.SEARCH_RESULT);
        el.previousLogins = document.querySelector(Selector.PREVIOUS_LOGINS);

        schools = await fetchSchools();
        renderPreviousLogins();
    });



    /* =====================================================================
       Previous Logins
       ===================================================================== */

    function getPreviousLogins() {
        if (!localStorage.getItem(PREVIOUS_LOGINS_STORAGE_KEY)) {
            return [];
        }

        const previousLoginCandidates = JSON.parse(localStorage.getItem(PREVIOUS_LOGINS_STORAGE_KEY));

        // Only previous logins that exists in schools.json
        const previousLogins = previousLoginCandidates.filter(item => {
            return schools.some(school => school.url === item);
        });

        return previousLogins;
    }

    function addPreviousLogin(schoolUrl) {
        schoolUrl = schoolUrl.endsWith('/') ? schoolUrl.slice(0, -1) : schoolUrl;

        let logins = getPreviousLogins();

        if (logins.includes(schoolUrl)) {
            return;
        }

        logins.push(schoolUrl);

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

        const previousSchools = schools.filter(school => previousLogins.includes(school.url));

        const ul = document.createElement('ul');

        ul.innerHTML = previousSchools.map(school => `
            <li class="sign-in__previous-login-item" data-element="sign-in__previous-login-item">
                <a href="${school.url}">
                    <span>${school.name}</span>
                </a>
                <button class="sign-in__previous-login-delete-button" data-element="sign-in__previous-login-delete-button" title="Remove">
                    <svg viewBox="0 0 16 16" width="16" height="16">
                        <path fill-rule="evenodd" fill="currentColor" d="M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zm4.5 0V3h2.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75zM4.496 6.675a.75.75 0 10-1.492.15l.66 6.6A1.75 1.75 0 005.405 15h5.19c.9 0 1.652-.681 1.741-1.576l.66-6.6a.75.75 0 00-1.492-.149l-.66 6.6a.25.25 0 01-.249.225h-5.19a.25.25 0 01-.249-.225l-.66-6.6z"></path>
                    </svg>
                </button>
                <div class="sign-in__previous-login-delete-confirm-popover">
                    <button class="sign-in__previous-login-confirm-delete" 
                            data-element="sign-in__previous-login-confirm-delete"
                            data-url="${school.url}">
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



    /* =====================================================================
       Search Result
       ===================================================================== */

    document.addEventListener('input', event => {
        if (event.target !== el.searchInput) {
            return;
        }

        renderSearchResult(event.target.value);
    });

    function renderSearchResult(query) {
        if (!query) {
            el.searchResult.hidden = true;
            return;
        }

        const searchResult = search(query);
        const searchResultHTML = createSearchResultHTML(searchResult);

        el.searchResult.innerHTML = searchResultHTML;
        selectSearchResultItem();

        el.searchResult.hidden = false;
    }

    document.addEventListener('keydown', event => {
        if (event.target !== el.searchInput) {
            return;
        }

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault(); // don't move cursor
                selectSearchResultItem('down')
                break;
            case "ArrowUp":
                event.preventDefault(); // don't move cursor
                selectSearchResultItem('up')
                break;
            case "Enter":
                navigateToSelectedItem();
                break;
            case "Escape":
                event.preventDefault(); // don't clear input
                el.searchResult.hidden = true;
                break;
        }
    });

    document.addEventListener('focus', event => {
        if (event.target !== el.searchInput) {

            setTimeout(() => {
                // give time for potential click event to happen
                el.searchResult.hidden = true;
            }, 100);

            return;
        }

        renderSearchResult(event.target.value);
    }, true);

    document.addEventListener('blur', event => {

        setTimeout(() => {
            // give time for potential click event to happen
            el.searchResult.hidden = true;
        }, 100);

    }, true);

    function selectSearchResultItem(direction) {
        const searchResultItems = el.searchResult.querySelectorAll('li');

        if (!searchResultItems.length) {
            return;
        }

        if (!direction) {
            for (const item of searchResultItems) {
                item.classList.remove('selected');
            }

            selectItem(searchResultItems[0]);
            return;
        }

        const selectedItem = el.searchResult.querySelector('.selected');

        if (!selectedItem) {
            selectItem(searchResultItems[0]);
            return;
        }

        const selectedIndex = indexOfElement(selectedItem);

        let newIndex = direction === 'up' ? selectedIndex - 1 : selectedIndex + 1;

        if (newIndex < 0) {
            newIndex = searchResultItems.length - 1;
        }

        if (newIndex >= searchResultItems.length) {
            newIndex = 0;
        }

        for (const item of searchResultItems) {
            item.classList.remove('selected');
        }

        selectItem(searchResultItems[newIndex]);
    }

    function selectItem(item) {
        if (!item.matches('.sign-in__search-result-empty')) {
            item.classList.add('selected');
        }
    }

    function navigateToSelectedItem() {
        const selectedLink = el.searchResult.querySelector('li.selected a');
        if (!selectedLink) {
            return;
        }

        selectedLink.click();
    }

    function search(query) {
        const queryLowerCase = query.toLowerCase();

        const results = schools.filter(school => {
            if (school.nameLowerCase.includes(queryLowerCase)) return true;
            if (school.subdomain.includes(queryLowerCase)) return true;
            return false;
        });

        return results;
    }

    function createSearchResultHTML(searchResult) {
        const htmlArray = [];

        for (const item of searchResult) {
            const itemHTML = createSearchResultItemHTML(item);
            htmlArray.push(itemHTML);
        }

        if (htmlArray.length < 1) {
            htmlArray.push(`<li class="sign-in__search-result-empty"><span lang="sv">Ingen sökträff</span><span lang="en">No match found</span></li>`);
        }

        return htmlArray.join('');
    }

    function createSearchResultItemHTML(item) {
        return `
            <li>
                <a href="${item.url}">
                    <span>${item.name}</span>
                </a>
            </li>`;
    }



    /* =====================================================================
       Delete Previous Login
       ===================================================================== */

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

    function closeDeletePreviousLoginPopovers() {
        const openPopovers = document.querySelectorAll('[data-element="sign-in__previous-login-item"].POPOVER-OPEN');
        openPopovers.forEach(popover => popover.classList.remove('POPOVER-OPEN'));
    }

    document.addEventListener('keyup', event => {
        if (event.key === "Escape") {
            closeDeletePreviousLoginPopovers();
        }
    });

    document.addEventListener('click', event => {
        const listItem = event.target.closest('[data-element="sign-in__search-result"] li');
        if (!listItem) {
            return;
        }

        const schoolLink = listItem.querySelector('a');
        if (!schoolLink) {
            return;
        }

        addPreviousLogin(schoolLink.href);
    });



    /* =====================================================================
       Fetch Schools
       ===================================================================== */

    async function fetchSchools() {
        const schoolsData = [];

        const res = await fetch('/schools.json');
        const schools = await res.json();

        for (const school of schools) {
            schoolsData.push({
                url: school.url.endsWith('/') ? school.url.slice(0, -1) : school.url,
                name: school.name,
                nameLowerCase: school.name.toLowerCase(),
                hostname: new URL(school.url).hostname,
                subdomain: new URL(school.url).hostname.split('.')[0]
            });
        }

        return schoolsData.sort((a, b) => {
            if (a.name === b.name) return 0;
            if (a.name > b.name) return 1;
            return -1;
        });
    }



    /* =====================================================================
       Prevent Form Submit
       ===================================================================== */

    document.addEventListener('submit', event => {
        event.preventDefault();
    }, true);



    /* =====================================================================
       Pageshow
       ===================================================================== */

    window.addEventListener('pageshow', event => {
        // Handle bfcache
        if (event.persisted) {
            el.searchInput.value = '';
            renderPreviousLogins();
            el.searchInput.focus();
        }
    });



    /* =====================================================================
       Index of Element
       ===================================================================== */

    function indexOfElement(element) {
        const parent = element.parentNode;

        let i = parent.children.length - 1;

        for (; i >= 0; i--) {
            if (element == parent.children[i]) {
                break;
            }
        }

        return i;
    }

})();
