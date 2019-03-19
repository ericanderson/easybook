import PluginDependency from "../../models/pluginDependency";
import hasPlugin from "./hasPlugin";
import isDefaultPlugin from "./isDefaultPlugin";

/**
 * Enable/disable a plugin dependency
 * @param {Config} config
 * @param {String} pluginName
 * @param {Boolean} state (optional)
 * @return {Config}
 */
function togglePlugin(config, pluginName, state) {
    var deps = config.getPluginDependencies();

    // For default plugin, we should ensure it's listed first
    if (isDefaultPlugin(pluginName) && !hasPlugin(deps, pluginName)) {
        deps = deps.push(PluginDependency.create(pluginName));
    }

    deps = deps.map(function(dep) {
        if (dep.getName() === pluginName) {
            return dep.toggle(state);
        }

        return dep;
    });

    return config.setPluginDependencies(deps);
}

export default togglePlugin;