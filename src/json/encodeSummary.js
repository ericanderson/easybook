import encodeFile from "./encodeFile";
import encodeSummaryPart from "./encodeSummaryPart";

/**
    Encode a summary to JSON

    @param {Summary}
    @return {Object}
*/
function encodeSummary(summary) {
    var file = summary.getFile();
    var parts = summary.getParts();

    return {
        file: encodeFile(file),
        parts: parts.map(encodeSummaryPart).toJS()
    };
}

export default encodeSummary;
