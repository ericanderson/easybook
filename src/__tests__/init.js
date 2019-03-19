import tmp from "tmp";
import initBook from "../init";

describe("initBook", function() {
    it("should create a README and SUMMARY for empty book", function() {
        var dir = tmp.dirSync();

        return initBook(dir.name).then(function() {
            expect(dir.name).toHaveFile("README.md");
            expect(dir.name).toHaveFile("SUMMARY.md");
        });
    });
});
