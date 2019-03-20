import npmi from "npmi";
import DEFAULT_PLUGINS from "../constants/defaultPlugins";
import Promise, {forEach} from "../utils/promise";
import installPlugin from "./installPlugin";

/**
    Install plugin requirements for a book

    @param {Book}
    @return {Promise<Number>}
*/
function installPlugins(book) {
    var logger = book.getLogger();
    var config = book.getConfig();
    var plugins = config.getPluginDependencies();

    // Remove default plugins
    // (only if version is same as installed)
    plugins = plugins.filterNot(function(plugin) {
        var dependency = DEFAULT_PLUGINS.find(function(dep) {
            return dep.getName() === plugin.getName();
        });

        return (
            // Disabled plugin
            !plugin.isEnabled() ||
            // Or default one installed in GitBook itself
            (dependency && plugin.getVersion() === dependency.getVersion())
        );
    });

    if (plugins.size == 0) {
        logger.info.ln("nothing to install!");
        return Promise(0);
    }

    logger.info.ln(
        "installing",
        plugins.size,
        "plugins using npm@" + npmi.NPM_VERSION
    );

    return forEach(plugins, function(plugin) {
        return installPlugin(book, plugin);
    }).thenResolve(plugins.size);
}

export default installPlugins;
