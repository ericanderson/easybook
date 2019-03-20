import Immutable from "immutable";
import TemplateBlock from "../../models/templateBlock";
import replaceShortcuts from "../replaceShortcuts";

describe("replaceShortcuts", () => {
    var blocks = Immutable.List([
        TemplateBlock.create("math", {
            shortcuts: {
                start: "$$",
                end: "$$",
                parsers: ["markdown"]
            }
        })
    ]);

    it("should correctly replace inline matches by block", () => {
        var content = replaceShortcuts(blocks, "test.md", "Hello $$a = b$$");
        expect(content).toBe("Hello {% math %}a = b{% endmath %}");
    });

    it("should correctly replace block matches", () => {
        var content = replaceShortcuts(
            blocks,
            "test.md",
            "Hello\n$$\na = b\n$$\n"
        );
        expect(content).toBe("Hello\n{% math %}\na = b\n{% endmath %}\n");
    });
});
