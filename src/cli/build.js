import Parse from "../parse";
import Output from "../output";
import timing from "../utils/timing";
import options from "./options";
import getBook from "./getBook";
import getOutputFolder from "./getOutputFolder";

export default {
    name: "build [book] [output]",
    description: "build a book",
    options: [options.log, options.format, options.timing],
    exec: function(bookDir, outputDir, command) {
        const kwargs = {
            format: command.format,
            log: command.log,
            timing: command.timing
        };
        const book = getBook(bookDir, kwargs);
        const outputFolder = getOutputFolder([bookDir, outputDir]);

        const Generator = Output.getGenerator(kwargs.format || "website");

        return Parse.parseBook(book)
            .then(function(resultBook) {
                return Output.generate(Generator, resultBook, {
                    root: outputFolder
                });
            })
            .fin(function() {
                if (kwargs.timing) timing.dump(book.getLogger());
            });
    }
};
