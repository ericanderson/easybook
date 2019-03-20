import path from "path";
import fs from "../../utils/fs";
import Promise from "../../utils/promise";
import listSearchPaths from "./listSearchPaths";

/**
 * Prepare i18n, load translations from plugins and book
 *
 * @param {Output}
 * @return {Promise<Output>}
 */
function prepareI18n(output) {
    var state = output.getState();
    var i18n = state.getI18n();
    var searchPaths = listSearchPaths(output);

    searchPaths.reverse().forEach(searchPath => {
        var i18nRoot = path.resolve(searchPath, "_i18n");

        if (!fs.existsSync(i18nRoot)) return;
        i18n.load(i18nRoot);
    });

    return Promise(output);
}

export default prepareI18n;
