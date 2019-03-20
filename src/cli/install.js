import options from "./options";
import getBook from "./getBook";
import Parse from "../parse";
import Plugins from "../plugins";

export default {
    name: "install [book]",
    description: "install all plugins dependencies",
    options: [options.log],
    exec: function(args, kwargs) {
        var book = getBook(args, kwargs);

        return Parse.parseConfig(book).then(resultBook =>
            Plugins.installPlugins(resultBook)
        );
    }
};
