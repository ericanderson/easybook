import Promise, { reduce } from "../utils/promise";
import timing from "../utils/timing";
import Book from "../models/book";
import parseIgnore from "./parseIgnore";
import parseConfig from "./parseConfig";
import parseGlossary from "./parseGlossary";
import parseSummary from "./parseSummary";
import parseReadme from "./parseReadme";
import parseLanguages from "./parseLanguages";

/**
    Parse content of a book

    @param {Book} book
    @return {Promise<Book>}
*/
function parseBookContent(book) {
    return Promise(book)
        .then(parseReadme)
        .then(parseSummary)
        .then(parseGlossary);
}

/**
    Parse a multilingual book

    @param {Book} book
    @return {Promise<Book>}
*/
function parseMultilingualBook(book) {
    var languages = book.getLanguages();
    var langList = languages.getList();

    return reduce(
        langList,
        (currentBook, lang) => {
            var langID = lang.getID();
            var child = Book.createFromParent(currentBook, langID);
            var ignore = currentBook.getIgnore();

            return Promise(child)
                .then(parseConfig)
                .then(parseBookContent)
                .then(result => {
                    // Ignore content of this book when generating parent book
                    ignore = ignore.add(langID + "/**");
                    currentBook = currentBook.set("ignore", ignore);

                    return currentBook.addLanguageBook(langID, result);
                });
        },
        book
    );
}

/**
    Parse a whole book from a filesystem

    @param {Book} book
    @return {Promise<Book>}
*/
function parseBook(book) {
    return timing.measure(
        "parse.book",
        Promise(book)
            .then(parseIgnore)
            .then(parseConfig)
            .then(parseLanguages)
            .then(resultBook => {
                if (resultBook.isMultilingual()) {
                    return parseMultilingualBook(resultBook);
                } else {
                    return parseBookContent(resultBook);
                }
            })
    );
}

export default parseBook;
