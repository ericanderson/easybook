import path from "path";
import Promise from "../utils/promise";
import error from "../utils/error";
import timing from "../utils/timing";
import Templating from "../templating";
import JSONUtils from "../json";
import createTemplateEngine from "./createTemplateEngine";
import callPageHook from "./callPageHook";

/**
 * Prepare and generate HTML for a page
 *
 * @param {Output} output
 * @param {Page} page
 * @return {Promise<Page>}
 */
function generatePage(output, page) {
    var book = output.getBook();
    var engine = createTemplateEngine(output);

    return timing.measure(
        "page.generate",
        Promise(page).then(function(resultPage) {
            var file = resultPage.getFile();
            var filePath = file.getPath();
            var parser = file.getParser();
            var context = JSONUtils.encodeOutputWithPage(output, resultPage);

            if (!parser) {
                return Promise.reject(
                    error.FileNotParsableError({
                        filename: filePath
                    })
                );
            }

            // Call hook "page:before"
            return (
                callPageHook("page:before", output, resultPage)
                    // Escape code blocks with raw tags
                    .then(function(currentPage) {
                        return parser.preparePage(currentPage.getContent());
                    })

                    // Render templating syntax
                    .then(function(content) {
                        var absoluteFilePath = path.join(
                            book.getContentRoot(),
                            filePath
                        );
                        return Templating.render(
                            engine,
                            absoluteFilePath,
                            content,
                            context
                        );
                    })

                    .then(function(output) {
                        var content = output.getContent();

                        return parser.parsePage(content).then(function(result) {
                            return output.setContent(result.content);
                        });
                    })

                    // Post processing for templating syntax
                    .then(function(output) {
                        return Templating.postRender(engine, output);
                    })

                    // Return new page
                    .then(function(content) {
                        return resultPage.set("content", content);
                    })

                    // Call final hook
                    .then(function(currentPage) {
                        return callPageHook("page", output, currentPage);
                    })
            );
        })
    );
}

export default generatePage;
