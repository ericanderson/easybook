import Immutable from "immutable";
import Book from "../../models/book";
import createMockFS from "../../fs/mock";
import listAssets from "../listAssets";
import parseGlossary from "../parseGlossary";

describe("listAssets", () => {
    it("should not list glossary as asset", () => {
        var fs = createMockFS({
            "GLOSSARY.md": "# Glossary\n\n## Hello\nDescription for hello",
            "assetFile.js": "",
            assets: {
                "file.js": ""
            }
        });
        var book = Book.createForFS(fs);

        return parseGlossary(book)
            .then(resultBook => {
                return listAssets(resultBook, Immutable.Map());
            })
            .then(assets => {
                expect(assets.size).toBe(2);
                expect(assets.includes("assetFile.js"));
                expect(assets.includes("assets/file.js"));
            });
    });
});
