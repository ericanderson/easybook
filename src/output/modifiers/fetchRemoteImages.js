import path from "path";
import crc from "crc";
import editHTMLElement from "./editHTMLElement";
import fs from "../../utils/fs";
import LocationUtils from "../../utils/location";

/**
    Fetch all remote images

    @param {String} rootFolder
    @param {String} currentFile
    @param {HTMLDom} $
    @return {Promise}
*/
function fetchRemoteImages(rootFolder, currentFile, $) {
    var currentDirectory = path.dirname(currentFile);

    return editHTMLElement($, "img", function($img) {
        var src = $img.attr("src");
        var extension = path.extname(src);

        if (!LocationUtils.isExternal(src)) {
            return;
        }

        // We avoid generating twice the same PNG
        var hash = crc.crc32(src).toString(16);
        var fileName = hash + extension;
        var filePath = path.join(rootFolder, fileName);

        return fs
            .assertFile(filePath, function() {
                return fs.download(src, filePath);
            })
            .then(function() {
                // Convert to relative
                src = LocationUtils.relative(currentDirectory, fileName);

                $img.replaceWith('<img src="' + src + '" />');
            });
    });
}

export default fetchRemoteImages;
