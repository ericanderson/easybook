import path from "path";
import Book from "../../models/book";
import createNodeFS from "../../fs/node";
import findForBook from "../findForBook";

describe("findForBook", () => {
    const fs = createNodeFS(path.resolve(__dirname, "../../.."));
    const book = Book.createForFS(fs);

    it("should list default plugins", () =>
        findForBook(book).then(plugins => {
            expect(plugins.has("fontsettings")).toBeTruthy();
        }));
});
