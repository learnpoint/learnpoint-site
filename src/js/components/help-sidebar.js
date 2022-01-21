(function () {

    const SEARCH_DEBOUNCE = 500;
    const STORAGE_KEY = 'help-pages-data';

    let searchService;
    let searchTimeout = null;

    const Selector = {
        SEARCH_INPUT: '[data-element="help-sidebar.search-input"]',
        SEARCH_RESULTS: '.help-sidebar__search-results'
    }

    window.addEventListener('load', async function () {
        const helpSearchData = await getHelpPagesData();

        // console.log(helpSearchData)

        const options = {
            includeScore: true,
            includeMatches: true,
            threshold: 0.8,
            ignoreLocation: true,
            keys: ['title', 'description', 'content']
        }

        searchService = new Fuse(helpSearchData, options);
    });

    document.addEventListener('input', event => {
        if (!event.target.matches(Selector.SEARCH_INPUT)) {
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
    }

    async function getHelpPagesData() {
        if (!sessionStorage.getItem(STORAGE_KEY)) {
            const res = await fetch('/pages.json');
            const pagesData = await res.json();
            const searchPagesData = pagesData.filter(item => item.url.includes("/help/"));
            const searchPagesCleanedData = searchPagesData.map(item => {
                item.title = item.title.replace(' - Learnpoint', '');
                return item;
            });

            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(searchPagesCleanedData));
        }

        return JSON.parse(sessionStorage.getItem(STORAGE_KEY));
    }

})();
