import Promise from "../../utils/promise";
import Book from "../../models/book";
import createMockFS from "../../fs/mock";

describe("parseReadme", function() {
    var parseReadme = require("../parseReadme").default;

    it("should parse summary if exists", function() {
        var fs = createMockFS({
            "README.md": "# Hello\n\nAnd here is the description."
        });
        var book = Book.createForFS(fs);

        return parseReadme(book).then(function(resultBook) {
            var readme = resultBook.getReadme();
            var file = readme.getFile();

            expect(file.exists()).toBeTruthy();
            expect(readme.getTitle()).toBe("Hello");
            expect(readme.getDescription()).toBe(
                "And here is the description."
            );
        });
    });

    it("should fail if doesn't exist", function() {
        var fs = createMockFS({});
        var book = Book.createForFS(fs);

        return parseReadme(book).then(
            function(resultBook) {
                throw new Error("It should have fail");
            },
            function() {
                return Promise();
            }
        );
    });
});
