import cheerio from "cheerio";
import Promise, { forEach } from "../../utils/promise";

/**
    Apply a list of operations to a page and
    output the new page.

    @param {Page}
    @param {List|Array<Transformation>}
    @return {Promise<Page>}
*/
function modifyHTML(page, operations) {
    var html = page.getContent();
    var $ = cheerio.load(html);

    return forEach(operations, op => {
        return op($);
    }).then(() => {
        var resultHTML = $.html();
        return page.set("content", resultHTML);
    });
}

export default modifyHTML;
