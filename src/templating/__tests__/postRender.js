import TemplateEngine from "../../models/templateEngine";
import TemplateBlock from "../../models/templateBlock";
import renderTemplate from "../render";
import postRender from "../postRender";

describe("postRender", () => {
    let testPost;
    const engine = TemplateEngine.create({
        blocks: [
            TemplateBlock.create("lower", blk => blk.body.toLowerCase()),
            TemplateBlock.create("prefix", blk => ({
                body: `_${blk.body}_`,

                post: function() {
                    testPost = true;
                }
            }))
        ]
    });

    it("should correctly replace block", () =>
        renderTemplate(
            engine,
            "README.md",
            "Hello {% lower %}Samy{% endlower %}"
        )
            .then(output => {
                expect(output.getContent()).toMatch(
                    /Hello \{\{\-([\S]+)\-\}\}/
                );
                expect(output.getBlocks().size).toBe(1);

                return postRender(engine, output);
            })
            .then(result => {
                expect(result).toBe("Hello samy");
            }));

    it("should correctly replace blocks", () =>
        renderTemplate(
            engine,
            "README.md",
            "Hello {% lower %}Samy{% endlower %}{% prefix %}Pesse{% endprefix %}"
        )
            .then(output => {
                expect(output.getContent()).toMatch(
                    /Hello \{\{\-([\S]+)\-\}\}\{\{\-([\S]+)\-\}\}/
                );
                expect(output.getBlocks().size).toBe(2);
                return postRender(engine, output);
            })
            .then(result => {
                expect(result).toBe("Hello samy_Pesse_");
                expect(testPost).toBe(true);
            }));
});
