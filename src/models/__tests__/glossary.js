import File from "../file";
import Glossary from "../glossary";
import GlossaryEntry from "../glossaryEntry";

describe("Glossary", () => {
    var glossary = Glossary.createFromEntries(File(), [
        {
            name: "Hello World",
            description: "Awesome!"
        },
        {
            name: "JavaScript",
            description: "This is a cool language"
        }
    ]);

    describe("createFromEntries", () => {
        it("must add all entries", () => {
            var entries = glossary.getEntries();
            expect(entries.size).toBe(2);
        });

        it("must add entries as GlossaryEntries", () => {
            var entries = glossary.getEntries();
            var entry = entries.get("hello-world");
            expect(entry instanceof GlossaryEntry).toBeTruthy();
        });
    });

    describe("toText", () => {
        it("return as markdown", () => {
            return glossary.toText(".md").then(text => {
                expect(text).toContain("# Glossary");
            });
        });
    });
});
