import encodeFile from "./encodeFile";

/**
    Encode a languages listing to JSON

    @param {Languages}
    @return {Object}
*/
function encodeLanguages(languages) {
    var file = languages.getFile();
    var list = languages.getList();

    return {
        file: encodeFile(file),
        list: list
            .valueSeq()
            .map(lang => ({
                id: lang.getID(),
                title: lang.getTitle()
            }))
            .toJS()
    };
}

export default encodeLanguages;
