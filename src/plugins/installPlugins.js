import npmi from "npmi";
import DEFAULT_PLUGINS from "../constants/defaultPlugins";
import Promise, { forEach } from "../utils/promise";
import installPlugin from "./installPlugin";

/**
    Install plugin requirements for a book

    @param {Book}
    @return {Promise<Number>}
*/
function installPlugins(book) {
    const logger = book.getLogger();
    const config = book.getConfig();
    let plugins = config.getPluginDependencies();

    // Remove default plugins
    // (only if version is same as installed)
    plugins = plugins.filterNot(plugin => {
        const dependency = DEFAULT_PLUGINS.find(
            dep => dep.getName() === plugin.getName()
        );

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
        `plugins using npm@${npmi.NPM_VERSION}`
    );

    return forEach(plugins, plugin => installPlugin(book, plugin)).thenResolve(
        plugins.size
    );
}

export default installPlugins;
