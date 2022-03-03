(function () {


    /* =====================================================================
       Selectors
       ===================================================================== */

    const Selector = {
        SIDEBAR: '[data-element="help-sidebar"]',
        OPEN_BUTTON: '[data-element="help-sidebar.open-button"]',
        CLOSE_BUTTON: '[data-element="help-sidebar.close-button"]',
        SUBTREE_TOGGLER: '[data-element="help-sidebar.subtree-toggler"]'
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
       Toggle Subtree
       ===================================================================== */

    document.addEventListener('click', event => {
        if (!event.target.closest(Selector.SUBTREE_TOGGLER)) {
            return;
        }

        const liContainer = event.target.closest('li');
        liContainer.classList.toggle(ClassName.OPEN);
    });



    /* =====================================================================
       Init Selected and Open
       ===================================================================== */

    function initSelectedAndOpen() {
        const path = location.pathname.replace('index.html', '');
        const links = document.querySelectorAll('[data-element="help-sidebar"] ul a');

        for (const link of links) {
            const href = link.getAttribute('href').replace('index.html', '');
            if (href === path) {
                link.classList.add(ClassName.SELECTED);
                const parentList = link.closest('ul').closest('li');
                if (parentList) {
                    parentList.classList.add(ClassName.OPEN);
                }
                break;
            }
        }
    }

})();
