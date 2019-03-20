import Plugins from "../plugins";
import Promise from "../utils/promise";

/**
 * Load and setup plugins
 *
 * @param {Output}
 * @return {Promise<Output>}
 */
function preparePlugins(output) {
    var book = output.getBook();

    return (
        Promise()
            // Only load plugins for main book
            .then(() => {
                if (book.isLanguageBook()) {
                    return output.getPlugins();
                } else {
                    return Plugins.loadForBook(book);
                }
            })

            // Update book's configuration using the plugins
            .then(plugins =>
                Plugins.validateConfig(book, plugins).then(newBook =>
                    output.merge({
                        book: newBook,
                        plugins
                    })
                )
            )
    );
}

export default preparePlugins;
