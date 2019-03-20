import Book from "../../models/book";
import createMockFS from "../../fs/mock";

describe("parseIgnore", () => {
    const parseIgnore = require("../parseIgnore").default;
    const fs = createMockFS({
        ".ignore": "test-1.js",
        ".gitignore": "test-2.js\ntest-3.js",
        ".bookignore": "!test-3.js",
        "test-1.js": "1",
        "test-2.js": "2",
        "test-3.js": "3"
    });

    function getBook() {
        const book = Book.createForFS(fs);
        return parseIgnore(book);
    }

    it("should load rules from .ignore", () =>
        getBook().then(book => {
            expect(book.isFileIgnored("test-1.js")).toBeTruthy();
        }));

    it("should load rules from .gitignore", () =>
        getBook().then(book => {
            expect(book.isFileIgnored("test-2.js")).toBeTruthy();
        }));

    it("should load rules from .bookignore", () =>
        getBook().then(book => {
            expect(book.isFileIgnored("test-3.js")).toBeFalsy();
        }));
});
