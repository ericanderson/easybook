import path from "path";
import locateRootFolder from "../locateRootFolder";

describe("locateRootFolder", function() {
    it("should correctly resolve the node_modules for gitbook", function() {
        expect(locateRootFolder()).toBe(path.resolve(__dirname, "../../../"));
    });
});
