import path from "path";
import locateRootFolder from "../locateRootFolder";

describe("locateRootFolder", () => {
    it("should correctly resolve the node_modules for gitbook", () => {
        expect(locateRootFolder()).toBe(path.resolve(__dirname, "../../../"));
    });
});
