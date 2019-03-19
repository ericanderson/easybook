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
    exec: function(args, kwargs) {
        var book = getBook(args, kwargs);
        var outputFolder = getOutputFolder(args);

        var Generator = Output.getGenerator(kwargs.format);

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
