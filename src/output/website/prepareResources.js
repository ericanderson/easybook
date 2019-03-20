import is from "is";
import Immutable from "immutable";
import Promise, { forEach } from "../../utils/promise";
import Api from "../../api";

/**
    Prepare plugins resources, add all output corresponding type resources

    @param {Output}
    @return {Promise<Output>}
*/
function prepareResources(output) {
    var plugins = output.getPlugins();
    var options = output.getOptions();
    var type = options.get("prefix");
    var state = output.getState();
    var context = Api.encodeGlobal(output);

    var result = Immutable.Map();

    return forEach(plugins, plugin => {
        var pluginResources = plugin.getResources(type);

        return Promise()
            .then(() => {
                // Apply resources if is a function
                if (is.fn(pluginResources)) {
                    return Promise().then(pluginResources.bind(context));
                } else {
                    return pluginResources;
                }
            })
            .then(resources => {
                result = result.set(plugin.getName(), Immutable.Map(resources));
            });
    }).then(() => {
        // Set output resources
        state = state.merge({
            resources: result
        });

        output = output.merge({
            state: state
        });

        return output;
    });
}

export default prepareResources;
