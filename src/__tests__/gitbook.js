import gitbook from "../gitbook";

describe("satisfies", function() {
    it("should return true for *", function() {
        expect(gitbook.satisfies("*")).toBe(true);
    });
});
