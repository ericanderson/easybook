import cheerio from "cheerio";
import Promise from "../../../utils/promise";
import highlightCode from "../highlightCode";

describe("highlightCode", () => {
    function doHighlight(lang, code) {
        return {
            text: `${lang || ""}$${code}`
        };
    }

    function doHighlightAsync(lang, code) {
        return Promise().then(() => doHighlight(lang, code));
    }

    it("should call it for normal code element", () => {
        const $ = cheerio.load("<p>This is a <code>test</code></p>");

        return highlightCode(doHighlight, $).then(() => {
            const $code = $("code");
            expect($code.text()).toBe("$test");
        });
    });

    it("should call it for markdown code block", () => {
        const $ = cheerio.load('<pre><code class="lang-js">test</code></pre>');

        return highlightCode(doHighlight, $).then(() => {
            const $code = $("code");
            expect($code.text()).toBe("js$test");
        });
    });

    it("should call it for asciidoc code block", () => {
        const $ = cheerio.load(
            '<pre><code class="language-python">test</code></pre>'
        );

        return highlightCode(doHighlight, $).then(() => {
            const $code = $("code");
            expect($code.text()).toBe("python$test");
        });
    });

    it("should accept async highlighter", () => {
        const $ = cheerio.load(
            '<pre><code class="language-python">test</code></pre>'
        );

        return highlightCode(doHighlightAsync, $).then(() => {
            const $code = $("code");
            expect($code.text()).toBe("python$test");
        });
    });
});
