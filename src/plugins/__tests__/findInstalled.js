import path from "path";
import Immutable from "immutable";

describe("findInstalled", () => {
    var findInstalled = require("../findInstalled").default;

    it("must list default plugins for gitbook directory", () => {
        // Read gitbook-plugins from package.json
        var pkg = require(path.resolve(__dirname, "../../../package.json"));
        var gitbookPlugins = Immutable.Seq(pkg.dependencies)
            .filter((v, k) => {
                return k.indexOf("gitbook-plugin") === 0;
            })
            .cacheResult();

        return findInstalled(path.resolve(__dirname, "../../../")).then(
            plugins => {
                expect(plugins.size >= gitbookPlugins.size).toBeTruthy();

                expect(plugins.has("fontsettings")).toBe(true);
                expect(plugins.has("search")).toBe(true);
            }
        );
    });
});
