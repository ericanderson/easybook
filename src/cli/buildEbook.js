import path from "path";
import tmp from "tmp";
import Promise from "../utils/promise";
import fs from "../utils/fs";
import Parse from "../parse";
import Output from "../output";
import options from "./options";
import getBook from "./getBook";

export default function(format) {
    return {
        name: format + " [book] [output]",
        description: "build a book into an ebook file",
        options: [options.log],
        exec: function(args, kwargs) {
            var extension = "." + format;

            // Output file will be stored in
            var outputFile = args[1] || "book" + extension;

            // Create temporary directory
            var outputFolder = tmp.dirSync().name;

            var book = getBook(args, kwargs);
            var logger = book.getLogger();
            var Generator = Output.getGenerator("ebook");

            return (
                Parse.parseBook(book)
                    .then(resultBook => {
                        return Output.generate(Generator, resultBook, {
                            root: outputFolder,
                            format: format
                        });
                    })

                    // Extract ebook file
                    .then(output => {
                        var book = output.getBook();
                        var languages = book.getLanguages();

                        if (book.isMultilingual()) {
                            return Promise.forEach(
                                languages.getList(),
                                lang => {
                                    var langID = lang.getID();

                                    var langOutputFile = path.join(
                                        path.dirname(outputFile),
                                        path.basename(outputFile, extension) +
                                            "_" +
                                            langID +
                                            extension
                                    );

                                    return fs.copy(
                                        path.resolve(
                                            outputFolder,
                                            langID,
                                            "index" + extension
                                        ),
                                        langOutputFile
                                    );
                                }
                            ).thenResolve(languages.getCount());
                        } else {
                            return fs
                                .copy(
                                    path.resolve(
                                        outputFolder,
                                        "index" + extension
                                    ),
                                    outputFile
                                )
                                .thenResolve(1);
                        }
                    })

                    // Log end
                    .then(count => {
                        logger.info.ok(count + " file(s) generated");

                        logger.debug("cleaning up... ");
                        return logger.debug.promise(fs.rmDir(outputFolder));
                    })
            );
        }
    };
}
