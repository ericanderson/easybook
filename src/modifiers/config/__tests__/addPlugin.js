import addPlugin from "../addPlugin";
import Config from "../../../models/config";

describe("addPlugin", () => {
    var config = Config.createWithValues({
        plugins: ["hello", "world", "-disabled"]
    });

    it("should have correct state of dependencies", () => {
        var disabledDep = config.getPluginDependency("disabled");

        expect(disabledDep).toBeDefined();
        expect(disabledDep.getVersion()).toEqual("*");
        expect(disabledDep.isEnabled()).toBeFalsy();
    });

    it("should add the plugin to the list", () => {
        var newConfig = addPlugin(config, "test");

        var testDep = newConfig.getPluginDependency("test");
        expect(testDep).toBeDefined();
        expect(testDep.getVersion()).toEqual("*");
        expect(testDep.isEnabled()).toBeTruthy();

        var disabledDep = newConfig.getPluginDependency("disabled");
        expect(disabledDep).toBeDefined();
        expect(disabledDep.getVersion()).toEqual("*");
        expect(disabledDep.isEnabled()).toBeFalsy();
    });
});
