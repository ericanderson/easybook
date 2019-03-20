import svgToImg from "./svgToImg";
import svgToPng from "./svgToPng";
import inlinePng from "./inlinePng";
import resolveImages from "./resolveImages";
import fetchRemoteImages from "./fetchRemoteImages";
import Promise from "../../utils/promise";

/**
    Inline all assets in a page

    @param {String} rootFolder
*/
function inlineAssets(rootFolder, currentFile) {
    return $ =>
        Promise()
            // Resolving images and fetching external images should be
            // done before svg conversion
            .then(resolveImages.bind(null, currentFile, $))
            .then(fetchRemoteImages.bind(null, rootFolder, currentFile, $))

            .then(svgToImg.bind(null, rootFolder, currentFile, $))
            .then(svgToPng.bind(null, rootFolder, currentFile, $))
            .then(inlinePng.bind(null, rootFolder, currentFile, $));
}

export default inlineAssets;
