import path from "path";
import resolve from "resolve";
import DEFAULT_PLUGINS from "../constants/defaultPlugins";

/**
 * Resolve the root folder containing for node_modules
 * since gitbook can be used as a library and dependency can be flattened.
 *
 * @return {String} folderPath
 */
function locateRootFolder() {
    var firstDefaultPlugin = DEFAULT_PLUGINS.first();
    var pluginPath = resolve.sync(
        firstDefaultPlugin.getNpmID() + "/package.json",
        {
            basedir: __dirname
        }
    );
    var nodeModules = path.resolve(pluginPath, "../../..");

    return nodeModules;
}

export default locateRootFolder;
