import Promise, { serie } from "../utils/promise";
import IGNORE_FILES from "../constants/ignoreFiles";

var DEFAULT_IGNORES = [
    // Skip Git stuff
    ".git/",

    // Skip OS X meta data
    ".DS_Store",

    // Skip stuff installed by plugins
    "node_modules",

    // Skip book outputs
    "_book",

    // Ignore files in the templates folder
    "_layouts"
];

/**
    Parse ignore files

    @param {Book}
    @return {Book}
*/
function parseIgnore(book) {
    if (book.isLanguageBook()) {
        return Promise.reject(
            new Error("Ignore files could be parsed for language books")
        );
    }

    var fs = book.getFS();
    var ignore = book.getIgnore();

    ignore = ignore.add(DEFAULT_IGNORES);

    return serie(IGNORE_FILES, filename => {
        return fs.readAsString(filename).then(
            content => {
                ignore = ignore.add(content.toString().split(/\r?\n/));
            },
            err => {
                return Promise();
            }
        );
    }).then(() => {
        return book.setIgnore(ignore);
    });
}

export default parseIgnore;
