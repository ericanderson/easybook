import Promise from "../../utils/promise";
import Book from "../../models/book";
import createMockFS from "../../fs/mock";

describe("parseReadme", () => {
    const parseReadme = require("../parseReadme").default;

    it("should parse summary if exists", () => {
        const fs = createMockFS({
            "README.md": "# Hello\n\nAnd here is the description."
        });
        const book = Book.createForFS(fs);

        return parseReadme(book).then(resultBook => {
            const readme = resultBook.getReadme();
            const file = readme.file;

            expect(file.exists()).toBeTruthy();
            expect(readme.title).toBe("Hello");
            expect(readme.description).toBe("And here is the description.");
        });
    });

    it("should fail if doesn't exist", () => {
        const fs = createMockFS({});
        const book = Book.createForFS(fs);

        return parseReadme(book).then(
            resultBook => {
                throw new Error("It should have fail");
            },
            () => Promise()
        );
    });
});
