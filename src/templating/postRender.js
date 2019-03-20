import Promise, { forEach } from "../utils/promise";

/**
 * Replace position markers of blocks by body after processing
 * This is done to avoid that markdown/asciidoc processer parse the block content
 *
 * @param {String} content
 * @return {Object} {blocks: Set, content: String}
 */
function replaceBlocks(content, blocks) {
    var newContent = content.replace(
        /\{\{\-\%([\s\S]+?)\%\-\}\}/g,
        (match, key) => {
            var replacedWith = match;

            var block = blocks.get(key);
            if (block) {
                replacedWith = replaceBlocks(block.get("body"), blocks);
            }

            return replacedWith;
        }
    );

    return newContent;
}

/**
 * Post render a template:
 *     - Execute "post" for blocks
 *     - Replace block content
 *
 * @param {TemplateEngine} engine
 * @param {TemplateOutput} content
 * @return {Promise<String>}
 */
function postRender(engine, output) {
    var content = output.getContent();
    var blocks = output.getBlocks();

    var result = replaceBlocks(content, blocks);

    return forEach(blocks, block => {
        var post = block.get("post");

        if (!post) {
            return;
        }

        return post();
    }).thenResolve(result);
}

export default postRender;
