import path from "path";
import PluginDependency from "../../models/pluginDependency";
import Book from "../../models/book";
import NodeFS from "../../fs/node";
import installPlugin from "../installPlugin";
import Parse from "../../parse";

describe("installPlugin", function() {
    let book;

    this.timeout(30000);

    before(() => {
        const fs = NodeFS(path.resolve(__dirname, "../../../"));
        const baseBook = Book.createForFS(fs);

        return Parse.parseConfig(baseBook).then(_book => {
            book = _book;
        });
    });

    it("must install a plugin from NPM", () => {
        const dep = PluginDependency.createFromString("ga");
        return installPlugin(book, dep);
    });
});
