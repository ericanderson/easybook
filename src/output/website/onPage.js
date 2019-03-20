import path from "path";
import omit from "omit-keys";
import Templating from "../../templating";
import Plugins from "../../plugins";
import JSONUtils from "../../json";
import LocationUtils from "../../utils/location";
import Modifiers from "../modifiers";
import writeFile from "../helper/writeFile";
import getModifiers from "../getModifiers";
import createTemplateEngine from "./createTemplateEngine";
import fileToOutput from "../helper/fileToOutput";

/**
 * Write a page as a json file
 *
 * @param {Output} output
 * @param {Page} page
 */
function onPage(output, page) {
    var options = output.getOptions();
    var prefix = options.get("prefix");

    var file = page.getFile();

    var book = output.getBook();
    var plugins = output.getPlugins();
    var state = output.getState();
    var resources = state.getResources();

    var engine = createTemplateEngine(output, page.getPath());

    // Output file path
    var filePath = fileToOutput(output, file.getPath());

    // Calcul relative path to the root
    var outputDirName = path.dirname(filePath);
    var basePath = LocationUtils.normalize(path.relative(outputDirName, "./"));

    return Modifiers.modifyHTML(page, getModifiers(output, page)).then(
        resultPage => {
            // Generate the context
            var context = JSONUtils.encodeOutputWithPage(output, resultPage);
            context.plugins = {
                resources: Plugins.listResources(plugins, resources).toJS()
            };

            context.template = {
                getJSContext: function() {
                    return {
                        page: omit(context.page, "content"),
                        config: context.config,
                        file: context.file,
                        gitbook: context.gitbook,
                        basePath: basePath,
                        book: {
                            language: book.getLanguage()
                        }
                    };
                }
            };

            // We should probabbly move it to "template" or a "site" namespace
            context.basePath = basePath;

            // Render the theme
            return (
                Templating.renderFile(engine, prefix + "/page.html", context)

                    // Write it to the disk
                    .then(tplOut =>
                        writeFile(output, filePath, tplOut.getContent())
                    )
            );
        }
    );
}

export default onPage;
