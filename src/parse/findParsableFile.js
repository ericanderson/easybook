import path from "path";
import Promise, { some } from "../utils/promise";
import parsers from "../parsers";

/**
    Find a file parsable (Markdown or AsciiDoc) in a book

    @param {Book} book
    @param {String} filename
    @return {Promise<File | Undefined>}
*/
function findParsableFile(book, filename) {
    var fs = book.getContentFS();
    var ext = path.extname(filename);
    var basename = path.basename(filename, ext);
    var basedir = path.dirname(filename);

    // Ordered list of extensions to test
    var exts = parsers.extensions;

    return some(exts, ext => {
        var filepath = basename + ext;

        return fs.findFile(basedir, filepath).then(found => {
            if (!found || book.isContentFileIgnored(found)) {
                return undefined;
            }

            return fs.statFile(found);
        });
    });
}

export default findParsableFile;
