import PluginDependency from "../../models/pluginDependency";
import listDependencies from "../listDependencies";
import toNames from "../toNames";

describe("listDependencies", () => {
    it("must list default", () => {
        var deps = PluginDependency.listFromString("ga,great");
        var plugins = listDependencies(deps);
        var names = toNames(plugins);

        expect(names).toEqual([
            "ga",
            "great",
            "highlight",
            "search",
            "lunr",
            "sharing",
            "fontsettings",
            "theme-default"
        ]);
    });

    it("must list from array with -", () => {
        var deps = PluginDependency.listFromString("ga,-great");
        var plugins = listDependencies(deps);
        var names = toNames(plugins);

        expect(names).toEqual([
            "ga",
            "highlight",
            "search",
            "lunr",
            "sharing",
            "fontsettings",
            "theme-default"
        ]);
    });

    it("must remove default plugins using -", () => {
        var deps = PluginDependency.listFromString("ga,-search");
        var plugins = listDependencies(deps);
        var names = toNames(plugins);

        expect(names).toEqual([
            "ga",
            "highlight",
            "lunr",
            "sharing",
            "fontsettings",
            "theme-default"
        ]);
    });
});
