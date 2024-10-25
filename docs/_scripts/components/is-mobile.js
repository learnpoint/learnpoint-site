(function () {

    const MOBILE_WIDTH = 768;

    const isMobileQuery = matchMedia(`(max-width: ${MOBILE_WIDTH}px)`);

    isMobileQuery.addEventListener('change', setScreenMode);

    function isMobile() {
        if (isMobileQuery.matches) {
            return true;
        } else {
            return false;
        }
    }

    function setScreenMode() {
        if (isMobile()) {
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

    setScreenMode();

})();
