import tmp from "tmp";
import Book from "../../models/book";
import createMockFS from "../../fs/mock";
import parseBook from "../../parse/parseBook";
import generateBook from "../generateBook";

/**
 * Generate a book using a generator
 * And returns the path to the output dir.
 *
 * FOR TESTING PURPOSE ONLY
 *
 * @param {Generator}
 * @param {Map<String:String|Map>} files
 * @return {Promise<String>}
 */
function generateMock(Generator, files) {
    const fs = createMockFS(files);
    let book = Book.createForFS(fs);
    let dir;

    try {
        dir = tmp.dirSync();
    } catch (err) {
        throw err;
    }

    book = book.setLogLevel("disabled");

    return parseBook(book)
        .then(resultBook =>
            generateBook(Generator, resultBook, {
                root: dir.name
            })
        )
        .thenResolve(dir.name);
}

export default generateMock;
