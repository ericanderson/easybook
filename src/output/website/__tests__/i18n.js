import createMockOutput from "../../__tests__/createMock";
import prepareI18n from "../prepareI18n";
import createTemplateEngine from "../createTemplateEngine";
import WebsiteGenerator from "../";

describe("i18n", function() {
    it("should correctly use english as default language", function() {
        return createMockOutput(WebsiteGenerator, {
            "README.md": "Hello World"
        })
            .then(function(output) {
                return prepareI18n(output);
            })
            .then(function(output) {
                var engine = createTemplateEngine(output, "README.md");
                var t = engine.getFilters().get("t");

                expect(t("SUMMARY_INTRODUCTION")).toEqual("Introduction");
            });
    });

    it("should correctly use language from book.json", function() {
        return createMockOutput(WebsiteGenerator, {
            "README.md": "Hello World",
            "book.json": JSON.stringify({ language: "fr" })
        })
            .then(function(output) {
                return prepareI18n(output);
            })
            .then(function(output) {
                var engine = createTemplateEngine(output, "README.md");
                var t = engine.getFilters().get("t");

                expect(t("GITBOOK_LINK")).toEqual("Publié avec GitBook");
            });
    });
});
