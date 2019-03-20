import crc from "crc";
import path from "path";
import imagesUtil from "../../utils/images";
import fs from "../../utils/fs";
import LocationUtils from "../../utils/location";
import editHTMLElement from "./editHTMLElement";

/**
    Convert all SVG images to PNG

    @param {String} rootFolder
    @param {HTMLDom} $
    @return {Promise}
*/
function svgToPng(rootFolder, currentFile, $) {
    const currentDirectory = path.dirname(currentFile);

    return editHTMLElement($, "img", $img => {
        let src = $img.attr("src");
        if (path.extname(src) !== ".svg") {
            return;
        }

        // Calcul absolute path for this
        src = LocationUtils.toAbsolute(src, currentDirectory, ".");

        // We avoid generating twice the same PNG
        const hash = crc.crc32(src).toString(16);
        let fileName = `${hash}.png`;

        // Input file path
        const inputPath = path.join(rootFolder, src);

        // Result file path
        const filePath = path.join(rootFolder, fileName);

        return fs
            .assertFile(filePath, () =>
                imagesUtil.convertSVGToPNG(inputPath, filePath)
            )
            .then(() => {
                // Convert filename to a relative filename
                fileName = LocationUtils.relative(currentDirectory, fileName);

                // Replace src
                $img.attr("src", fileName);
            });
    });
}

export default svgToPng;
