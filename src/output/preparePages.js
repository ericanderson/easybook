import Parse from "../parse";
import Promise from "../utils/promise";

/**
    List and prepare all pages

    @param {Output}
    @return {Promise<Output>}
*/
function preparePages(output) {
    var book = output.getBook();
    var logger = book.getLogger();

    if (book.isMultilingual()) {
        return Promise(output);
    }

    return Parse.parsePagesList(book).then(function(pages) {
        logger.info.ln("found", pages.size, "pages");

        return output.set("pages", pages);
    });
}

export default preparePages;
