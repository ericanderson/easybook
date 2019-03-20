import togglePlugin from "../togglePlugin";
import Config from "../../../models/config";

describe("togglePlugin", () => {
    var config = Config.createWithValues({
        plugins: ["hello", "world", "-disabled"]
    });

    it("should enable plugin", () => {
        var newConfig = togglePlugin(config, "disabled");

        var testDep = newConfig.getPluginDependency("disabled");
        expect(testDep).toBeDefined();
        expect(testDep.getVersion()).toEqual("*");
        expect(testDep.isEnabled()).toBeTruthy();
    });

    it("should disable plugin", () => {
        var newConfig = togglePlugin(config, "world");

        var testDep = newConfig.getPluginDependency("world");
        expect(testDep).toBeDefined();
        expect(testDep.getVersion()).toEqual("*");
        expect(testDep.isEnabled()).toBeFalsy();
    });
});
