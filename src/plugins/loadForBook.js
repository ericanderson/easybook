import Immutable from "immutable";
import Promise, { map } from "../utils/promise";
import listDepsForBook from "./listDepsForBook";
import findForBook from "./findForBook";
import loadPlugin from "./loadPlugin";

/**
 * Load all plugins in a book
 *
 * @param {Book}
 * @return {Promise<Map<String:Plugin>}
 */
function loadForBook(book) {
    var logger = book.getLogger();

    // List the dependencies
    var requirements = listDepsForBook(book);

    // List all plugins installed in the book
    return findForBook(book).then(installedMap => {
        var missing = [];
        var plugins = requirements.reduce((result, dep) => {
            var name = dep.getName();
            var installed = installedMap.get(name);

            if (installed) {
                var deps = installedMap
                    .filter(plugin => plugin.getParent() === name)
                    .toArray();

                result = result.concat(deps);
                result.push(installed);
            } else {
                missing.push(name);
            }

            return result;
        }, []);

        // Convert plugins list to a map
        plugins = Immutable.List(plugins).map(plugin => [
            plugin.getName(),
            plugin
        ]);
        plugins = Immutable.OrderedMap(plugins);

        // Log state
        logger.info.ln(installedMap.size + " plugins are installed");
        if (requirements.size != installedMap.size) {
            logger.info.ln(requirements.size + " explicitly listed");
        }

        // Verify that all plugins are present
        if (missing.length > 0) {
            throw new Error(
                "Couldn't locate plugins \"" +
                    missing.join(", ") +
                    "\", Run 'gitbook install' to install plugins from registry."
            );
        }

        return map(plugins, plugin => loadPlugin(book, plugin));
    });
}

export default loadForBook;
