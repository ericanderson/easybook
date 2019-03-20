import path from "path";
import Book from "../../models/book";
import NodeFS from "../../fs/node";
import installPlugins from "../installPlugins";
import Parse from "../../parse";

describe("installPlugins", function() {
    var book;

    this.timeout(30000);

    before(() => {
        var fs = NodeFS(path.resolve(__dirname, "../../../"));
        var baseBook = Book.createForFS(fs);

        return Parse.parseConfig(baseBook).then(_book => {
            book = _book;
        });
    });

    it("must install all plugins from NPM", () =>
        installPlugins(book).then(n => {
            expect(n).toBe(0);
        }));
});
