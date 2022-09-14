(function () {

    const MOBILE_WIDTH = 768;

    const query = window.matchMedia(`(max-width: ${MOBILE_WIDTH}px)`);
    query.addEventListener('change', setScreenMode);

    setScreenMode();

    function setScreenMode() {
        if (query.matches) {
            window.isMobile = true;
            window.isDesktop = false;
            document.documentElement.classList.add('is-mobile');
            document.documentElement.classList.remove('is-desktop');
        } else {
            window.isMobile = false;
            window.isDesktop = true;
            document.documentElement.classList.add('is-desktop');
            document.documentElement.classList.remove('is-mobile');
        }
    }
})();
