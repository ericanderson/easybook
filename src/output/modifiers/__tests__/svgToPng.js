import cheerio from "cheerio";
import tmp from "tmp";
import path from "path";
import svgToImg from "../svgToImg";
import svgToPng from "../svgToPng";

describe("svgToPng", () => {
    var dir;

    beforeEach(() => {
        dir = tmp.dirSync();
    });

    it("should write svg as png file", () => {
        var $ = cheerio.load(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100" version="1.1"><rect width="200" height="100" stroke="black" stroke-width="6" fill="green"/></svg>'
        );
        var fileName = "index.html";

        return svgToImg(dir.name, fileName, $)
            .then(() => {
                return svgToPng(dir.name, fileName, $);
            })
            .then(() => {
                var $img = $("img");
                var src = $img.attr("src");

                expect(dir.name).toHaveFile(src);
                expect(path.extname(src)).toBe(".png");
            });
    });
});
