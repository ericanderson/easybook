import Modifiers from "./modifiers";
import resolveFileToURL from "./helper/resolveFileToURL";
import Api from "../api";
import Plugins from "../plugins";
import Promise from "../utils/promise";
import defaultBlocks from "../constants/defaultBlocks";
import fileToOutput from "./helper/fileToOutput";

var CODEBLOCK = "code";

/**
 * Return default modifier to prepare a page for
 * rendering.
 *
 * @return {Array<Modifier>}
 */
function getModifiers(output, page) {
    var book = output.getBook();
    var plugins = output.getPlugins();
    var glossary = book.getGlossary();
    var file = page.getFile();

    // Glossary entries
    var entries = glossary.getEntries();
    var glossaryFile = glossary.getFile();
    var glossaryFilename = fileToOutput(output, glossaryFile.getPath());

    // Current file path
    var currentFilePath = file.getPath();

    // Get TemplateBlock for highlighting
    var blocks = Plugins.listBlocks(plugins);
    var code = blocks.get(CODEBLOCK) || defaultBlocks.get(CODEBLOCK);

    // Current context
    var context = Api.encodeGlobal(output);

    return [
        // Normalize IDs on headings
        Modifiers.addHeadingId,

        // Annotate text with glossary entries
        Modifiers.annotateText.bind(null, entries, glossaryFilename),

        // Resolve images
        Modifiers.resolveImages.bind(null, currentFilePath),

        // Resolve links (.md -> .html)
        Modifiers.resolveLinks.bind(
            null,
            currentFilePath,
            resolveFileToURL.bind(null, output)
        ),

        // Highlight code blocks using "code" block
        Modifiers.highlightCode.bind(null, (lang, source) =>
            Promise(
                code.applyBlock(
                    {
                        body: source,
                        kwargs: {
                            language: lang
                        }
                    },
                    context
                )
            ).then(result => {
                if (result.html === false) {
                    return { text: result.body };
                } else {
                    return { html: result.body };
                }
            })
        )
    ];
}

export default getModifiers;
