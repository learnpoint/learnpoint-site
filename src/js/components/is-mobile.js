(function () {
    const MOBILE_WIDTH = 768;

    function updateIsMobile() {
        if (document.documentElement.clientWidth && document.documentElement.clientWidth <= MOBILE_WIDTH) {
            window.isMobile = true;
            window.isDesktop = false;
            document.documentElement.classList.add('is-mobile');
            document.documentElement.classList.remove('is-desktop');
        } else {
            window.isMobile = false;
            window.isDesktop = true;
            document.documentElement.classList.remove('is-mobile');
            document.documentElement.classList.add('is-desktop');
        }
    }

    updateIsMobile();

    let timeout = null;

    window.addEventListener('resize', () => {
        const wait = 100; // 100ms debounce

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            timeout = null;
            updateIsMobile();
        }, wait);
    });

})();