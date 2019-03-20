import generateMock from "./generateMock";
import JSONGenerator from "../json";

describe("JSONGenerator", () => {
    it("should generate a README.json", () =>
        generateMock(JSONGenerator, {
            "README.md": "Hello World"
        }).then(folder => {
            expect(folder).toHaveFile("README.json");
        }));

    it("should generate a json file for each articles", () =>
        generateMock(JSONGenerator, {
            "README.md": "Hello World",
            "SUMMARY.md": "# Summary\n\n* [Page](test/page.md)",
            test: {
                "page.md": "Hello 2"
            }
        }).then(folder => {
            expect(folder).toHaveFile("README.json");
            expect(folder).toHaveFile("test/page.json");
        }));

    it("should generate a multilingual book", () =>
        generateMock(JSONGenerator, {
            "LANGS.md": "# Languages\n\n* [en](en)\n* [fr](fr)",
            en: {
                "README.md": "Hello"
            },
            fr: {
                "README.md": "Bonjour"
            }
        }).then(folder => {
            expect(folder).toHaveFile("en/README.json");
            expect(folder).toHaveFile("fr/README.json");
            expect(folder).toHaveFile("README.json");
        }));
});
