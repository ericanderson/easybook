import Immutable from "immutable";
import Output from "../../models/output";
import Book from "../../models/book";
import parseBook from "../../parse/parseBook";
import createMockFS from "../../fs/mock";
import preparePlugins from "../preparePlugins";

/**
 * Create an output using a generator
 *
 * FOR TESTING PURPOSE ONLY
 *
 * @param {Generator} generator
 * @param {Map<String:String|Map>} files
 * @return {Promise<Output>}
 */
function createMockOutput(generator, files, options) {
    var fs = createMockFS(files);
    var book = Book.createForFS(fs);
    var state = generator.State ? generator.State({}) : Immutable.Map();

    book = book.setLogLevel("disabled");
    options = generator.Options(options);

    return parseBook(book)
        .then(resultBook => {
            return new Output({
                book: resultBook,
                options: options,
                state: state,
                generator: generator.name
            });
        })
        .then(preparePlugins);
}

export default createMockOutput;
