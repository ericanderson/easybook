import Promise, { some } from "../utils/promise";
import validateConfig from "./validateConfig";
import CONFIG_FILES from "../constants/configFiles";

/**
    Parse configuration from "book.json" or "book.js"

    @param {Book} book
    @return {Promise<Book>}
*/
function parseConfig(book) {
    var fs = book.getFS();
    var config = book.getConfig();

    return some(CONFIG_FILES, filename => {
        // Is this file ignored?
        if (book.isFileIgnored(filename)) {
            return;
        }

        // Try loading it
        return fs
            .loadAsObject(filename)
            .then(cfg =>
                fs.statFile(filename).then(file => ({
                    file: file,
                    values: cfg
                }))
            )
            .fail(err => {
                if (err.code != "MODULE_NOT_FOUND") throw err;
                else return Promise(false);
            });
    }).then(result => {
        var values = result ? result.values : {};
        values = validateConfig(values);

        // Set the file
        if (result.file) {
            config = config.setFile(result.file);
        }

        // Merge with old values
        config = config.mergeValues(values);

        return book.setConfig(config);
    });
}

export default parseConfig;
