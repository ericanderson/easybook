import path from "path";
import Immutable from "immutable";
import Output from "../models/output";
import Promise, { forEach } from "../utils/promise";
import fs from "../utils/fs";
import callHook from "./callHook";
import preparePlugins from "./preparePlugins";
import preparePages from "./preparePages";
import prepareAssets from "./prepareAssets";
import generateAssets from "./generateAssets";
import generatePages from "./generatePages";

/**
 * Process an output to generate the book
 *
 * @param {Generator} generator
 * @param {Output} output
 * @return {Promise<Output>}
 */
function processOutput(generator, startOutput) {
    return Promise(startOutput)
        .then(preparePlugins)
        .then(preparePages)
        .then(prepareAssets)

        .then(
            callHook.bind(
                null,
                "config",
                output => {
                    const book = output.getBook();
                    const config = book.getConfig();
                    const values = config.getValues();

                    return values.toJS();
                },
                (output, result) => {
                    let book = output.getBook();
                    let config = book.getConfig();

                    config = config.updateValues(result);
                    book = book.set("config", config);
                    return output.set("book", book);
                }
            )
        )

        .then(callHook.bind(null, "init", output => ({}), output => output))

        .then(output => {
            if (!generator.onInit) {
                return output;
            }

            return generator.onInit(output);
        })

        .then(generateAssets.bind(null, generator))
        .then(generatePages.bind(null, generator))

        .tap(output => {
            const book = output.getBook();

            if (!book.isMultilingual()) {
                return;
            }

            const logger = book.getLogger();
            const books = book.getBooks();
            const outputRoot = output.getRoot();
            const plugins = output.getPlugins();
            const state = output.getState();
            const options = output.getOptions();

            return forEach(books, langBook => {
                // Inherits plugins list, options and state
                const langOptions = options.set(
                    "root",
                    path.join(outputRoot, langBook.getLanguage())
                );
                const langOutput = new Output({
                    book: langBook,
                    options: langOptions,
                    state,
                    generator: generator.name,
                    plugins
                });

                logger.info.ln("");
                logger.info.ln(
                    `generating language "${langBook.getLanguage()}"`
                );
                return processOutput(generator, langOutput);
            });
        })

        .then(
            callHook.bind(
                null,
                "finish:before",
                output => ({}),
                output => output
            )
        )

        .then(output => {
            if (!generator.onFinish) {
                return output;
            }

            return generator.onFinish(output);
        })

        .then(callHook.bind(null, "finish", output => ({}), output => output));
}

/**
 * Generate a book using a generator.
 *
 * The overall process is:
 *     1. List and load plugins for this book
 *     2. Call hook "config"
 *     3. Call hook "init"
 *     4. Initialize generator
 *     5. List all assets and pages
 *     6. Copy all assets to output
 *     7. Generate all pages
 *     8. Call hook "finish:before"
 *     9. Finish generation
 *     10. Call hook "finish"
 *
 *
 * @param {Generator} generator
 * @param {Book} book
 * @param {Object} options
 * @return {Promise<Output>}
 */
function generateBook(generator, book, options) {
    options = generator.Options(options);
    const state = generator.State ? generator.State({}) : Immutable.Map();
    const start = Date.now();

    return (
        Promise(
            new Output({
                book,
                options,
                state,
                generator: generator.name
            })
        )
            // Cleanup output folder
            .then(output => {
                const logger = output.getLogger();
                const rootFolder = output.getRoot();

                logger.debug.ln(`cleanup folder "${rootFolder}"`);
                return fs.ensureFolder(rootFolder).thenResolve(output);
            })

            .then(processOutput.bind(null, generator))

            // Log duration and end message
            .then(output => {
                const logger = output.getLogger();
                const end = Date.now();
                const duration = (end - start) / 1000;

                logger.info.ok(
                    `generation finished with success in ${duration.toFixed(
                        1
                    )}s !`
                );

                return output;
            })
    );
}

export default generateBook;
