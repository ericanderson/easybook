import path from "path";
import Book from "../../models/book";
import createNodeFS from "../../fs/node";
import findForBook from "../findForBook";

describe("findForBook", () => {
    var fs = createNodeFS(path.resolve(__dirname, "../../.."));
    var book = Book.createForFS(fs);

    it("should list default plugins", () => {
        return findForBook(book).then(plugins => {
            expect(plugins.has("fontsettings")).toBeTruthy();
        });
    });
});
