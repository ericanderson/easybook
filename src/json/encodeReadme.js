import encodeFile from "./encodeFile";

/**
    Encode a readme to JSON

    @param {Readme}
    @return {Object}
*/
function encodeReadme(readme) {
    var file = readme.file;

    return {
        file: encodeFile(file)
    };
}

export default encodeReadme;
