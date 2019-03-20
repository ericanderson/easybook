import parsePageFromString from "./parsePageFromString";

/**
 * Parse a page, read its content and parse the YAMl header
 *
 * @param {Book} book
 * @param {Page} page
 * @return {Promise<Page>}
 */
function parsePage(book, page) {
    var fs = book.getContentFS();
    var file = page.getFile();

    return fs.readAsString(file.getPath()).then(content => {
        return parsePageFromString(page, content);
    });
}

export default parsePage;
