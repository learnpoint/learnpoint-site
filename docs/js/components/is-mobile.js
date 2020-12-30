(function () {
    const MOBILE_WIDTH = 768;

    let timeout = null;

    function updateIsMobile() {
        const wait = 100; // 100ms debounce

        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
            timeout = null;
            if (document.documentElement.clientWidth && document.documentElement.clientWidth <= MOBILE_WIDTH) {
                window.isMobile = true;
                document.documentElement.classList.add('is-mobile');
            } else {
                window.isMobile = false;
                document.documentElement.classList.remove('is-mobile');
            }
        }, wait);
    }

    window.addEventListener('resize', updateIsMobile);

    updateIsMobile();
})();