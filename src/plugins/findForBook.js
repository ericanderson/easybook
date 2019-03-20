import Immutable from "immutable";
import Promise from "../utils/promise";
import timing from "../utils/timing";
import findInstalled from "./findInstalled";
import locateRootFolder from "./locateRootFolder";

/**
 * List all plugins installed in a book
 *
 * @param {Book}
 * @return {Promise<OrderedMap<String:Plugin>>}
 */
function findForBook(book) {
    return timing.measure(
        "plugins.findForBook",

        Promise.all([
            findInstalled(locateRootFolder()),
            findInstalled(book.getRoot())
        ])

            // Merge all plugins
            .then(results => {
                return Immutable.List(results).reduce((out, result) => {
                    return out.merge(result);
                }, Immutable.OrderedMap());
            })
    );
}

export default findForBook;
