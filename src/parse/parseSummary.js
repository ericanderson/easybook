import parseStructureFile from "./parseStructureFile";
import Summary from "../models/summary";
import unshiftArticle from "../modifiers/summary/unshiftArticle";
import Book from "../models/book";

/**
    Parse summary in a book, the summary can only be parsed
    if the readme as be detected before.

    @param {Book} book
    @return {Promise<Book>}
*/
function parseSummary(book) {
    var readme = book.getReadme();
    var logger = book.getLogger();
    var readmeFile = readme.file;

    return parseStructureFile(book, "summary").spread((file, result) => {
        var summary;

        if (!file) {
            logger.warn.ln("no summary file in this book");
            summary = Summary();
        } else {
            logger.debug.ln("summary file found at", file.getPath());
            summary = Summary.createFromParts(file, result.parts);
        }

        // Insert readme as first entry if not in SUMMARY.md
        var readmeArticle = summary.getByPath(readmeFile.getPath());

        if (readmeFile.exists() && !readmeArticle) {
            summary = unshiftArticle(summary, {
                title: "Introduction",
                ref: readmeFile.getPath()
            });
        }

        // Set new summary
        return book.setSummary(summary);
    });
}

export default parseSummary;
