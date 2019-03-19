import path from "path";
import Book from "../../models/book";
import createNodeFS from "../../fs/node";
import findForBook from "../findForBook";

describe("findForBook", function() {
    var fs = createNodeFS(path.resolve(__dirname, "../../.."));
    var book = Book.createForFS(fs);

    it("should list default plugins", function() {
        return findForBook(book).then(function(plugins) {
            expect(plugins.has("fontsettings")).toBeTruthy();
        });
    });
});
