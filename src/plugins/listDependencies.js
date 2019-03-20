import DEFAULT_PLUGINS from "../constants/defaultPlugins";
import sortDependencies from "./sortDependencies";

/**
 * List all dependencies for a book, including default plugins.
 * It returns a concat with default plugins and remove disabled ones.
 *
 * @param {List<PluginDependency>} deps
 * @return {List<PluginDependency>}
 */
function listDependencies(deps) {
    // Extract list of plugins to disable (starting with -)
    const toRemove = deps
        .filter(plugin => !plugin.isEnabled())
        .map(plugin => plugin.getName());

    // Concat with default plugins
    deps = deps.concat(DEFAULT_PLUGINS);

    // Remove plugins
    deps = deps.filterNot(plugin => toRemove.includes(plugin.getName()));

    // Sort
    return sortDependencies(deps);
}

export default listDependencies;
