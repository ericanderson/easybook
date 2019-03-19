import slug from "github-slugid";
import editHTMLElement from "./editHTMLElement";

/**
    Add ID to an heading

    @param {HTMLElement} heading
*/
function addId(heading) {
    if (heading.attr("id")) return;
    heading.attr("id", slug(heading.text()));
}

/**
    Add ID to all headings

    @param {HTMLDom} $
*/
function addHeadingId($) {
    return editHTMLElement($, "h1,h2,h3,h4,h5,h6", addId);
}

export default addHeadingId;
