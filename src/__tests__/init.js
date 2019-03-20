import tmp from "tmp";
import initBook from "../init";

describe("initBook", () => {
    it("should create a README and SUMMARY for empty book", () => {
        var dir = tmp.dirSync();

        return initBook(dir.name).then(() => {
            expect(dir.name).toHaveFile("README.md");
            expect(dir.name).toHaveFile("SUMMARY.md");
        });
    });
});
