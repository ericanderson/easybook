import Immutable from "immutable";
import path from "path";
import LocationUtils from "../utils/location";
import PLUGIN_RESOURCES from "../constants/pluginResources";

/**
    List all resources from a list of plugins

    @param {OrderedMap<String:Plugin>}
    @param {String} type
    @return {Map<String:List<{url, path}>}
*/
function listResources(plugins, resources) {
    return plugins.reduce(function(result, plugin) {
        var npmId = plugin.getNpmID();
        var pluginResources = resources.get(plugin.getName());

        PLUGIN_RESOURCES.forEach(function(resourceType) {
            var assets = pluginResources.get(resourceType);
            if (!assets) return;

            var list = result.get(resourceType) || Immutable.List();

            assets = assets.map(function(assetFile) {
                if (LocationUtils.isExternal(assetFile)) {
                    return {
                        url: assetFile
                    };
                } else {
                    return {
                        path: LocationUtils.normalize(
                            path.join(npmId, assetFile)
                        )
                    };
                }
            });

            list = list.concat(assets);
            result = result.set(resourceType, list);
        });

        return result;
    }, Immutable.Map());
}

export default listResources;
