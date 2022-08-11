(function () {


    /* =====================================================================
       Selectors
       ===================================================================== */

    const Selector = {
        SIDEBAR: '[data-element="help-sidebar"]',
        OPEN_BUTTON: '[data-element="help-sidebar.open-button"]',
        CLOSE_BUTTON: '[data-element="help-sidebar.close-button"]'
    }



    /* =====================================================================
       Class Names
       ===================================================================== */

    const ClassName = {
        OPEN: 'OPEN',
        SELECTED: 'SELECTED'
    }



    /* =====================================================================
       Init Selected and Open
       ===================================================================== */

    initSelectedAndOpen();



    /* =====================================================================
       Open Sidebar
       ===================================================================== */

    document.addEventListener('click', event => {
        if (!event.target.closest(Selector.OPEN_BUTTON)) {
            return;
        }

        const sidebar = document.querySelector(Selector.SIDEBAR);
        sidebar.classList.add(ClassName.OPEN);
    });



    /* =====================================================================
       Close Sidebar
       ===================================================================== */

    document.addEventListener('click', event => {
        if (!event.target.closest(Selector.CLOSE_BUTTON)) {
            return;
        }

        const sidebar = document.querySelector(Selector.SIDEBAR);
        sidebar.classList.remove(ClassName.OPEN);
    });



    /* =====================================================================
       Init Selected and Open
       ===================================================================== */

    function initSelectedAndOpen() {
        const currentPath = location.pathname;
        const matchingLinks = document.querySelectorAll(`[data-element="help-sidebar"] a[href="${currentPath}"]`);

        for (const matchingLink of matchingLinks) {
            matchingLink.classList.add(ClassName.SELECTED);
        }
    }

})();
