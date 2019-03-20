import Promise, { reduce } from "../utils/promise";
import generatePage from "./generatePage";

/**
    Output all pages using a generator

    @param {Generator} generator
    @param {Output} output
    @return {Promise<Output>}
*/
function generatePages(generator, output) {
    const pages = output.getPages();
    const logger = output.getLogger();

    // Is generator ignoring assets?
    if (!generator.onPage) {
        return Promise(output);
    }

    return reduce(
        pages,
        (out, page) => {
            const file = page.getFile();

            logger.debug.ln('generate page "' + file.getPath() + '"');

            return generatePage(out, page)
                .then(resultPage => generator.onPage(out, resultPage))
                .fail(err => {
                    logger.error.ln(
                        'error while generating page "' + file.getPath() + '":'
                    );
                    throw err;
                });
        },
        output
    );
}

export default generatePages;
