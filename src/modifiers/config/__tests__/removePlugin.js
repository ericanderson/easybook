import removePlugin from "../removePlugin";
import Config from "../../../models/config";

describe("removePlugin", () => {
    var config = Config.createWithValues({
        plugins: ["hello", "world", "-disabled"]
    });

    it("should remove the plugin from the list", () => {
        var newConfig = removePlugin(config, "hello");

        var testDep = newConfig.getPluginDependency("hello");
        expect(testDep).toNotBeDefined();
    });

    it("should remove the disabled plugin from the list", () => {
        var newConfig = removePlugin(config, "disabled");

        var testDep = newConfig.getPluginDependency("disabled");
        expect(testDep).toNotBeDefined();
    });

    it("should disable default plugin", () => {
        var newConfig = removePlugin(config, "search");

        var disabledDep = newConfig.getPluginDependency("search");
        expect(disabledDep).toBeDefined();
        expect(disabledDep.getVersion()).toEqual("*");
        expect(disabledDep.isEnabled()).toBeFalsy();
    });
});
