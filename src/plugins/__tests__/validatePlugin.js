import Promise from "../../utils/promise";
import Plugin from "../../models/plugin";
import validatePlugin from "../validatePlugin";

describe("validatePlugin", () => {
    it("must not validate a not loaded plugin", () => {
        const plugin = Plugin.createFromString("test");

        return validatePlugin(plugin).then(
            () => {
                throw new Error("Should not be validate");
            },
            err => Promise()
        );
    });
});
