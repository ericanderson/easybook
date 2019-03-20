import Promise from "../../utils/promise";
import Book from "../../models/book";
import createMockFS from "../../fs/mock";

describe("parseReadme", () => {
    var parseReadme = require("../parseReadme").default;

    it("should parse summary if exists", () => {
        var fs = createMockFS({
            "README.md": "# Hello\n\nAnd here is the description."
        });
        var book = Book.createForFS(fs);

        return parseReadme(book).then(resultBook => {
            var readme = resultBook.getReadme();
            var file = readme.file;

            expect(file.exists()).toBeTruthy();
            expect(readme.title).toBe("Hello");
            expect(readme.description).toBe("And here is the description.");
        });
    });

    it("should fail if doesn't exist", () => {
        var fs = createMockFS({});
        var book = Book.createForFS(fs);

        return parseReadme(book).then(
            resultBook => {
                throw new Error("It should have fail");
            },
            () => {
                return Promise();
            }
        );
    });
});
