import createMockOutput from "../../__tests__/createMock";
import prepareI18n from "../prepareI18n";
import createTemplateEngine from "../createTemplateEngine";
import WebsiteGenerator from "../";

describe("i18n", () => {
    it("should correctly use english as default language", () =>
        createMockOutput(WebsiteGenerator, {
            "README.md": "Hello World"
        })
            .then(output => prepareI18n(output))
            .then(output => {
                var engine = createTemplateEngine(output, "README.md");
                var t = engine.getFilters().get("t");

                expect(t("SUMMARY_INTRODUCTION")).toEqual("Introduction");
            }));

    it("should correctly use language from book.json", () =>
        createMockOutput(WebsiteGenerator, {
            "README.md": "Hello World",
            "book.json": JSON.stringify({ language: "fr" })
        })
            .then(output => prepareI18n(output))
            .then(output => {
                var engine = createTemplateEngine(output, "README.md");
                var t = engine.getFilters().get("t");

                expect(t("GITBOOK_LINK")).toEqual("Publié avec GitBook");
            }));
});
