(function () {
    window.addEventListener('beforeprint', event => {
        document.documentElement.classList.add('print');
    });

    window.addEventListener('afterprint', event => {
        document.documentElement.classList.remove('print');
    });
})();
