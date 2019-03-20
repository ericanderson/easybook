import Promise, { forEach } from "../../utils/promise";

/**
    Edit all elements matching a selector
*/
function editHTMLElement($, selector, fn) {
    var $elements = $(selector);

    return forEach($elements, el => {
        var $el = $(el);
        return fn($el);
    });
}

export default editHTMLElement;
