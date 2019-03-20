import Book from "../../models/book";
import createMockFS from "../../fs/mock";

describe("parseSummary", () => {
    const parseSummary = require("../parseSummary").default;

    it("should parse summary if exists", () => {
        const fs = createMockFS({
            "SUMMARY.md": "# Summary\n\n* [Hello](hello.md)"
        });
        const book = Book.createForFS(fs);

        return parseSummary(book).then(resultBook => {
            const summary = resultBook.getSummary();
            const file = summary.getFile();

            expect(file.exists()).toBeTruthy();
        });
    });

    it("should not fail if doesn't exist", () => {
        const fs = createMockFS({});
        const book = Book.createForFS(fs);

        return parseSummary(book).then(resultBook => {
            const summary = resultBook.getSummary();
            const file = summary.getFile();

            expect(file.exists()).toBeFalsy();
        });
    });
});
