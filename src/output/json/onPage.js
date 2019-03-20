import JSONUtils from "../../json";
import PathUtils from "../../utils/path";
import Modifiers from "../modifiers";
import writeFile from "../helper/writeFile";
import getModifiers from "../getModifiers";

var JSON_VERSION = "3";

/**
 * Write a page as a json file
 *
 * @param {Output} output
 * @param {Page} page
 */
function onPage(output, page) {
    var file = page.getFile();
    var readme = output.getBook().getReadme().file;

    return Modifiers.modifyHTML(page, getModifiers(output, page)).then(
        resultPage => {
            // Generate the JSON
            var json = JSONUtils.encodeBookWithPage(
                output.getBook(),
                resultPage
            );

            // Delete some private properties
            delete json.config;

            // Specify JSON output version
            json.version = JSON_VERSION;

            // File path in the output folder
            var filePath =
                file.getPath() == readme.getPath()
                    ? "README.json"
                    : file.getPath();
            filePath = PathUtils.setExtension(filePath, ".json");

            // Write it to the disk
            return writeFile(output, filePath, JSON.stringify(json, null, 4));
        }
    );
}

export default onPage;
