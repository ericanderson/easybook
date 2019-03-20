import escapeStringRegexp from "escape-string-regexp";
import listShortcuts from "./listShortcuts";

/**
 * Apply a shortcut of block to a template
 * @param {String} content
 * @param {Shortcut} shortcut
 * @return {String}
 */
function applyShortcut(content, shortcut) {
    var start = shortcut.getStart();
    var end = shortcut.getEnd();

    var tagStart = shortcut.getStartTag();
    var tagEnd = shortcut.getEndTag();

    var regex = new RegExp(
        escapeStringRegexp(start) +
            "([\\s\\S]*?[^\\$])" +
            escapeStringRegexp(end),
        "g"
    );
    return content.replace(
        regex,
        (all, match) =>
            "{% " + tagStart + " %}" + match + "{% " + tagEnd + " %}"
    );
}

/**
 * Replace shortcuts from blocks in a string
 *
 * @param {List<TemplateBlock>} engine
 * @param {String} filePath
 * @param {String} content
 * @return {String}
 */
function replaceShortcuts(blocks, filePath, content) {
    var shortcuts = listShortcuts(blocks, filePath);
    return shortcuts.reduce(applyShortcut, content);
}

export default replaceShortcuts;
