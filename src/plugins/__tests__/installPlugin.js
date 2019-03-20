import path from "path";
import PluginDependency from "../../models/pluginDependency";
import Book from "../../models/book";
import NodeFS from "../../fs/node";
import installPlugin from "../installPlugin";
import Parse from "../../parse";

describe("installPlugin", function() {
    var book;

    this.timeout(30000);

    before(function() {
        var fs = NodeFS(path.resolve(__dirname, "../../../"));
        var baseBook = Book.createForFS(fs);

        return Parse.parseConfig(baseBook).then(function(_book) {
            book = _book;
        });
    });

    it("must install a plugin from NPM", function() {
        var dep = PluginDependency.createFromString("ga");
        return installPlugin(book, dep);
    });
});
