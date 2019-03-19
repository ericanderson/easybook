import parseStructureFile from "./parseStructureFile";
import Glossary from "../models/glossary";

/**
    Parse glossary

    @param {Book} book
    @return {Promise<Book>}
*/
function parseGlossary(book) {
    var logger = book.getLogger();

    return parseStructureFile(book, "glossary").spread(function(file, entries) {
        if (!file) {
            return book;
        }

        logger.debug.ln("glossary index file found at", file.getPath());

        var glossary = Glossary.createFromEntries(file, entries);
        return book.set("glossary", glossary);
    });
}

export default parseGlossary;
