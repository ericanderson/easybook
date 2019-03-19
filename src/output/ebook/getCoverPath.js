import path from "path";
import fs from "../../utils/fs";

/**
    Resolve path to cover file to use

    @param {Output}
    @return {String}
*/
function getCoverPath(output) {
    var outputRoot = output.getRoot();
    var book = output.getBook();
    var config = book.getConfig();
    var coverName = config.getValue("cover", "cover.jpg");

    // Resolve to absolute
    var cover = fs.pickFile(outputRoot, coverName);
    if (cover) {
        return cover;
    }

    // Multilingual? try parent folder
    if (book.isLanguageBook()) {
        cover = fs.pickFile(path.join(outputRoot, ".."), coverName);
    }

    return cover;
}

export default getCoverPath;
