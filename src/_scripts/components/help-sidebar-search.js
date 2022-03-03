(function () {

    const SEARCH_DEBOUNCE = 500;
    const STORAGE_KEY = 'help-site-db';

    let searchService;
    let searchTimeout = null;

    const Selector = {
        SIDEBAR: '[data-element="help-sidebar"]',
        SEARCH_FORM: '[data-element="help-sidebar.search-form"]',
        SEARCH_INPUT: '[data-element="help-sidebar.search-input"]',
        SEARCH_RESULTS: '.help-sidebar__search-results'
    }

    const ClassName = {
        SEARCH_RESULTS_OPEN: 'OPEN'
    }

    window.addEventListener('load', async function () {
        const helpSiteDb = await getHelpSiteDb();

        const options = {
            includeScore: true,
            includeMatches: true,
            threshold: 0.3,
            ignoreLocation: true,
            keys: ['title', 'description', 'content']
        }

        searchService = new Fuse(helpSiteDb, options);
    });

    document.addEventListener('focus', event => {
        if (!event.target.matches(Selector.SEARCH_INPUT)) {
            return;
        }

        if (event.target.value === '') {
            closeSearchResults();
        } else {
            openSearchResults();
        }
    }, true);

    document.addEventListener('click', event => {
        // Close on click outside search form
        if (!event.target.closest(Selector.SEARCH_FORM)) {
            closeSearchResults();
        }

        // Open on click inside search input (might have been closed by Esc key)
        if (event.target.matches(Selector.SEARCH_INPUT) && event.target.value !== '') {
            openSearchResults();
        }
    });

    document.addEventListener('keyup', event => {
        if (event.key === 'Escape' || event.key === 'Esc') {
            closeSearchResults();
        }
    });

    document.addEventListener('input', event => {
        if (!event.target.matches(Selector.SEARCH_INPUT)) {
            return;
        }

        if (event.target.value === '') {
            closeSearchResults();
            return;
        }

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        searchTimeout = setTimeout(() => {
            searchTimeout = null;
            search(event.target.value);
        }, SEARCH_DEBOUNCE);

    });

    function search(value) {
        let searchResultHtml = '';

        const searchResult = searchService.search(value);

        if (searchResult.length === 0) {
            searchResultHtml = '<span>Inga träffar</span>';
        } else {
            searchResult.forEach(item => {
                searchResultHtml += `<a href="${item.item.url}">${item.item.title}</a>`;
            });
        }

        const searchResultsElement = document.querySelector(Selector.SEARCH_RESULTS);
        searchResultsElement.innerHTML = searchResultHtml;

        openSearchResults();
    }

    function openSearchResults() {
        const searchResults = document.querySelector(Selector.SEARCH_RESULTS);

        if (!searchResults) {
            return;
        }

        searchResults.classList.add(ClassName.SEARCH_RESULTS_OPEN);
    }

    function closeSearchResults() {
        const searchResults = document.querySelector(Selector.SEARCH_RESULTS);

        if (!searchResults) {
            return;
        }

        searchResults.classList.remove(ClassName.SEARCH_RESULTS_OPEN);
    }

    async function getHelpSiteDb() {
        if (!sessionStorage.getItem(STORAGE_KEY)) {
            const res = await fetch('/site_db.json');
            const siteDb = await res.json();
            const helpSiteDb = siteDb.filter(item => item.url.includes("/help/"));
            const helpSiteDbCleaned = helpSiteDb.map(item => {
                item.title = item.title.replace(' - Learnpoint', '');
                return item;
            });

            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(helpSiteDbCleaned));
        }

        return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    }

})();
