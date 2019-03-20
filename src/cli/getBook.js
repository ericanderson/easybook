import * as path from "path";
import Book from "../models/book";
import createNodeFS from "../fs/node";

/**
    Return a book instance to work on from
    command line args/kwargs

    @param {Array} args
    @param {Object} kwargs
    @return {Book}
*/
function getBook(book, kwargs) {
    var input = path.resolve(book || process.cwd());
    var logLevel = kwargs.log;

    var fs = createNodeFS(input);
    var book = Book.createForFS(fs);

    return book.setLogLevel(logLevel);
}

export default getBook;
