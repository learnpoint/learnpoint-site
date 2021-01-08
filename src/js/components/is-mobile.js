(function () {
    const MOBILE_WIDTH = 768;

    function updateIsMobile() {
        if (document.documentElement.clientWidth && document.documentElement.clientWidth <= MOBILE_WIDTH) {
            window.isMobile = true;
            document.documentElement.classList.add('is-mobile');
        } else {
            window.isMobile = false;
            document.documentElement.classList.remove('is-mobile');
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