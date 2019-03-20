import npmi from "npmi";
import Promise from "../utils/promise";
import resolveVersion from "./resolveVersion";

/**
    Install a plugin for a book

    @param {Book}
    @param {PluginDependency}
    @return {Promise}
*/
function installPlugin(book, plugin) {
    const logger = book.getLogger();

    const installFolder = book.getRoot();
    const name = plugin.getName();
    const requirement = plugin.getVersion();

    logger.info.ln("");
    logger.info.ln(`installing plugin "${name}"`);

    // Find a version to install
    return resolveVersion(plugin)
        .then(version => {
            if (!version) {
                throw new Error(
                    `Found no satisfactory version for plugin "${name}" with requirement "${requirement}"`
                );
            }

            logger.info.ln(
                `install plugin "${name}" (${requirement}) from NPM with version`,
                version
            );
            return Promise.nfcall(npmi, {
                name: plugin.getNpmID(),
                version,
                path: installFolder,
                npmLoad: {
                    loglevel: "silent",
                    loaded: true,
                    prefix: installFolder
                }
            });
        })
        .then(() => {
            logger.info.ok(`plugin "${name}" installed with success`);
        });
}

export default installPlugin;
