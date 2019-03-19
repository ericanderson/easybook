import Plugin from "../plugin";
describe("Plugin", function() {
    console.log(Plugin)

    describe("createFromString", function() {
        it("must parse name", function() {
            var plugin = Plugin.createFromString("hello");
            expect(plugin.getName()).toBe("hello");
            expect(plugin.getVersion()).toBe("*");
        });

        it("must parse version", function() {
            var plugin = Plugin.createFromString("hello@1.0.0");
            expect(plugin.getName()).toBe("hello");
            expect(plugin.getVersion()).toBe("1.0.0");
        });
    });

    describe("isLoaded", function() {
        it("must return false for empty plugin", function() {
            var plugin = Plugin.createFromString("hello");
            expect(plugin.isLoaded()).toBe(false);
        });
    });
});
