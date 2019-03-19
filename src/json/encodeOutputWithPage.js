import encodeOutput from "./encodeOutput";
import encodePage from "./encodePage";
import encodeFile from "./encodeFile";

/**
 * Return a JSON representation of a book with a specific file
 *
 * @param {Book} output
 * @param {Page} page
 * @return {Object}
 */
function encodeOutputWithPage(output, page) {
    var file = page.getFile();
    var book = output.getBook();

    var result = encodeOutput(output);
    result.page = encodePage(page, book.getSummary());
    result.file = encodeFile(file);

    return result;
}

export default encodeOutputWithPage;
