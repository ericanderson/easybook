import generateMock from "./generateMock";
import EbookGenerator from "../ebook";

describe("EbookGenerator", () => {
    it("should generate a SUMMARY.html", () =>
        generateMock(EbookGenerator, {
            "README.md": "Hello World"
        }).then(folder => {
            expect(folder).toHaveFile("SUMMARY.html");
            expect(folder).toHaveFile("index.html");
        }));
});
