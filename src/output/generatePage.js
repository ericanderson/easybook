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
    const book = output.getBook();
    const engine = createTemplateEngine(output);

    return timing.measure(
        "page.generate",
        Promise(page).then(resultPage => {
            const file = resultPage.getFile();
            const filePath = file.getPath();
            const parser = file.getParser();
            const context = JSONUtils.encodeOutputWithPage(output, resultPage);

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
                    .then(currentPage =>
                        parser.preparePage(currentPage.getContent())
                    )

                    // Render templating syntax
                    .then(content => {
                        const absoluteFilePath = path.join(
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

                    .then(output => {
                        const content = output.getContent();

                        return parser
                            .parsePage(content)
                            .then(result => output.setContent(result.content));
                    })

                    // Post processing for templating syntax
                    .then(output => Templating.postRender(engine, output))

                    // Return new page
                    .then(content => resultPage.set("content", content))

                    // Call final hook
                    .then(currentPage =>
                        callPageHook("page", output, currentPage)
                    )
            );
        })
    );
}

export default generatePage;
