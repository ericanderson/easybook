import Immutable from "immutable";
import cheerio from "cheerio";
import GlossaryEntry from "../../../models/glossaryEntry";
import annotateText from "../annotateText";

describe("annotateText", () => {
    var entries = Immutable.List([
        GlossaryEntry({ name: "Word" }),
        GlossaryEntry({ name: "Multiple Words" })
    ]);

    it("should annotate text", () => {
        var $ = cheerio.load("<p>This is a word, and multiple words</p>");

        annotateText(entries, "GLOSSARY.md", $);

        var links = $("a");
        expect(links.length).toBe(2);

        var word = $(links.get(0));
        expect(word.attr("href")).toBe("/GLOSSARY.md#word");
        expect(word.text()).toBe("word");
        expect(word.hasClass("glossary-term")).toBeTruthy();

        var words = $(links.get(1));
        expect(words.attr("href")).toBe("/GLOSSARY.md#multiple-words");
        expect(words.text()).toBe("multiple words");
        expect(words.hasClass("glossary-term")).toBeTruthy();
    });

    it("should not annotate scripts", () => {
        var $ = cheerio.load(
            "<script>This is a word, and multiple words</script>"
        );

        annotateText(entries, "GLOSSARY.md", $);
        expect($("a").length).toBe(0);
    });

    it('should not annotate when has class "no-glossary"', () => {
        var $ = cheerio.load(
            '<p class="no-glossary">This is a word, and multiple words</p>'
        );

        annotateText(entries, "GLOSSARY.md", $);
        expect($("a").length).toBe(0);
    });
});
