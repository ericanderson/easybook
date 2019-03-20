import Promise from "../../utils/promise";
import JSONUtils from "../../json";
import Templating from "../../templating";
import writeFile from "../helper/writeFile";
import createTemplateEngine from "./createTemplateEngine";

/**
    Finish the generation, write the languages index

    @param {Output}
    @return {Output}
*/
function onFinish(output) {
    var book = output.getBook();
    var options = output.getOptions();
    var prefix = options.get("prefix");

    if (!book.isMultilingual()) {
        return Promise(output);
    }

    var filePath = "index.html";
    var engine = createTemplateEngine(output, filePath);
    var context = JSONUtils.encodeOutput(output);

    // Render the theme
    return (
        Templating.renderFile(engine, prefix + "/languages.html", context)

            // Write it to the disk
            .then(tplOut => {
                return writeFile(output, filePath, tplOut.getContent());
            })
    );
}

export default onFinish;
