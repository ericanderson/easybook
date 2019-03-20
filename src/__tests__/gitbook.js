import gitbook from "../gitbook";

describe("satisfies", () => {
    it("should return true for *", () => {
        expect(gitbook.satisfies("*")).toBe(true);
    });
});
