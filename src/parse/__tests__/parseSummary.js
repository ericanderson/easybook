import Book from "../../models/book";
import createMockFS from "../../fs/mock";

describe("parseSummary", () => {
    var parseSummary = require("../parseSummary").default;

    it("should parse summary if exists", () => {
        var fs = createMockFS({
            "SUMMARY.md": "# Summary\n\n* [Hello](hello.md)"
        });
        var book = Book.createForFS(fs);

        return parseSummary(book).then(resultBook => {
            var summary = resultBook.getSummary();
            var file = summary.getFile();

            expect(file.exists()).toBeTruthy();
        });
    });

    it("should not fail if doesn't exist", () => {
        var fs = createMockFS({});
        var book = Book.createForFS(fs);

        return parseSummary(book).then(resultBook => {
            var summary = resultBook.getSummary();
            var file = summary.getFile();

            expect(file.exists()).toBeFalsy();
        });
    });
});
