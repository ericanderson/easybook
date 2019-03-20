import Plugin from "../plugin";
describe("Plugin", () => {
    describe("createFromString", () => {
        it("must parse name", () => {
            var plugin = Plugin.createFromString("hello");
            expect(plugin.getName()).toBe("hello");
            expect(plugin.getVersion()).toBe("*");
        });

        it("must parse version", () => {
            var plugin = Plugin.createFromString("hello@1.0.0");
            expect(plugin.getName()).toBe("hello");
            expect(plugin.getVersion()).toBe("1.0.0");
        });
    });

    describe("isLoaded", () => {
        it("must return false for empty plugin", () => {
            var plugin = Plugin.createFromString("hello");
            expect(plugin.isLoaded()).toBe(false);
        });
    });
});
