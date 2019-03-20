import juice from "juice";
import WebsiteGenerator from "../website";
import JSONUtils from "../../json";
import Templating from "../../templating";
import Promise from "../../utils/promise";

/**
    Generate PDF header/footer templates

    @param {Output} output
    @param {String} type
    @return {String}
*/
function getPDFTemplate(output, type) {
    var filePath = "pdf_" + type + ".html";
    var outputRoot = output.getRoot();
    var engine = WebsiteGenerator.createTemplateEngine(output, filePath);

    // Generate context
    var context = JSONUtils.encodeOutput(output);
    context.page = {
        num: "_PAGENUM_",
        title: "_SECTION_"
    };

    // Render the theme
    return (
        Templating.renderFile(engine, "ebook/" + filePath, context)

            // Inline css and assets
            .then(tplOut =>
                Promise.nfcall(juice.juiceResources, tplOut.getContent(), {
                    webResources: {
                        relativeTo: outputRoot
                    }
                })
            )
    );
}

export default getPDFTemplate;
