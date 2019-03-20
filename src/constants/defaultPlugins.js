import Immutable from "immutable";
import PluginDependency from "../models/pluginDependency";
import pkg from "../../package.json";

/**
 * Create a PluginDependency from a dependency of gitbook
 * @param {String} pluginName
 * @return {PluginDependency}
 */
function createFromDependency(pluginName) {
    var npmID = PluginDependency.nameToNpmID(pluginName);
    var version = pkg.dependencies[npmID];

    return PluginDependency.create(pluginName, version);
}

/*
 * List of default plugins for all books,
 * default plugins should be installed in node dependencies of GitBook
 */
export default Immutable.List([
    "highlight",
    "search",
    "lunr",
    "sharing",
    "fontsettings",
    "theme-default"
]).map(createFromDependency);
