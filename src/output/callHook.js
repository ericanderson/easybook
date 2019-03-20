import Promise, { reduce } from "../utils/promise";
import timing from "../utils/timing";
import Api from "../api";

function defaultGetArgument() {
    return undefined;
}

function defaultHandleResult(output, result) {
    return output;
}

/**
    Call a "global" hook for an output

    @param {String} name
    @param {Function(Output) -> Mixed} getArgument
    @param {Function(Output, result) -> Output} handleResult
    @param {Output} output
    @return {Promise<Output>}
*/
function callHook(name, getArgument, handleResult, output) {
    getArgument = getArgument || defaultGetArgument;
    handleResult = handleResult || defaultHandleResult;

    var logger = output.getLogger();
    var plugins = output.getPlugins();

    logger.debug.ln('calling hook "' + name + '"');

    // Create the JS context for plugins
    var context = Api.encodeGlobal(output);

    return timing.measure(
        "call.hook." + name,

        // Get the arguments
        Promise(getArgument(output))
            // Call the hooks in serie
            .then(arg => {
                return reduce(
                    plugins,
                    (prev, plugin) => {
                        var hook = plugin.getHook(name);
                        if (!hook) {
                            return prev;
                        }

                        return hook.call(context, prev);
                    },
                    arg
                );
            })

            // Handle final result
            .then(result => {
                output = Api.decodeGlobal(output, context);
                return handleResult(output, result);
            })
    );
}

export default callHook;
