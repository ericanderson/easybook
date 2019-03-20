import parseStructureFile from "./parseStructureFile";
import { createReadme } from "../models/readme";
import error from "../utils/error";

/**
    Parse readme from book

    @param {Book} book
    @return {Promise<Book>}
*/
function parseReadme(book) {
    var logger = book.getLogger();

    return parseStructureFile(book, "readme").spread((file, result) => {
        if (!file) {
            throw new error.FileNotFoundError({ filename: "README" });
        }

        logger.debug.ln("readme found at", file.getPath());

        var readme = createReadme(file, result);
        return book.set("readme", readme);
    });
}

export default parseReadme;
