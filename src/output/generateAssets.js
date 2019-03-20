import Promise, { reduce } from "../utils/promise";

/**
    Output all assets using a generator

    @param {Generator} generator
    @param {Output} output
    @return {Promise<Output>}
*/
function generateAssets(generator, output) {
    var assets = output.getAssets();
    var logger = output.getLogger();

    // Is generator ignoring assets?
    if (!generator.onAsset) {
        return Promise(output);
    }

    return reduce(
        assets,
        (out, assetFile) => {
            logger.debug.ln('copy asset "' + assetFile + '"');

            return generator.onAsset(out, assetFile);
        },
        output
    );
}

export default generateAssets;
