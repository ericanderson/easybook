import parsePageFromString from "../parsePageFromString";
import Page from "../../models/page";

describe("parsePageFromString", () => {
    var page = new Page();

    it("should parse YAML frontmatter", () => {
        var CONTENT = '---\nhello: true\nworld: "cool"\n---\n# Hello World\n';
        var newPage = parsePageFromString(page, CONTENT);

        expect(newPage.getDir()).toBe("ltr");
        expect(newPage.getContent()).toBe("# Hello World\n");

        var attrs = newPage.getAttributes();
        expect(attrs.size).toBe(2);
        expect(attrs.get("hello")).toBe(true);
        expect(attrs.get("world")).toBe("cool");
    });

    it("should parse text direction (english)", () => {
        var CONTENT = "Hello World";
        var newPage = parsePageFromString(page, CONTENT);

        expect(newPage.getDir()).toBe("ltr");
        expect(newPage.getContent()).toBe("Hello World");
        expect(newPage.getAttributes().size).toBe(0);
    });

    it("should parse text direction (arab)", () => {
        var CONTENT = "مرحبا بالعالم";
        var newPage = parsePageFromString(page, CONTENT);

        expect(newPage.getDir()).toBe("rtl");
        expect(newPage.getContent()).toBe("مرحبا بالعالم");
        expect(newPage.getAttributes().size).toBe(0);
    });
});
