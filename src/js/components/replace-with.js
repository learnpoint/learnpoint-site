(function () {

    // USAGE:
    // <svg data-replace-with="/icons/edit.svg"></svg>
    //
    // REQUIREMENT:
    // 1) The url resource must contain markup (html or svg)
    // 2) The markup must have one single root element

    const ATTRIBUTE = 'data-replace-with';
    const SELECTOR = `[${ATTRIBUTE}]`;

    document.addEventListener('DOMContentLoaded', () => {
        const replaceWithElements = document.querySelectorAll(SELECTOR);

        replaceWithElements.forEach(replaceWithElement => {
            const url = replaceWithElement.getAttribute(ATTRIBUTE);

            fetch(url)
                .then(res => res.text())
                .then(markup => {
                    const element = createElementFromMarkup(markup);
                    replaceWithElement.replaceWith(element);
                });
        });
    });


    function createElementFromMarkup(markup) {

        // REQUIREMENT: Single root element in html markup

        var template = document.createElement('template');
        template.innerHTML = markup.trim();
        return template.content.firstChild;
    }

})();
