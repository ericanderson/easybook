import extend from "extend";
import gitbook from "../gitbook";
import encodeSummary from "./encodeSummary";
import encodeGlossary from "./encodeGlossary";
import encodeReadme from "./encodeReadme";
import encodeLanguages from "./encodeLanguages";

/**
    Encode a book to JSON

    @param {Book}
    @return {Object}
*/
function encodeBookToJson(book) {
    var config = book.getConfig();
    var language = book.getLanguage();

    var variables = config.getValue("variables", {});

    return {
        summary: encodeSummary(book.getSummary()),
        glossary: encodeGlossary(book.getGlossary()),
        readme: encodeReadme(book.getReadme()),
        config: book
            .getConfig()
            .getValues()
            .toJS(),

        languages: book.isMultilingual()
            ? encodeLanguages(book.getLanguages())
            : undefined,

        gitbook: {
            version: gitbook.version,
            time: gitbook.START_TIME
        },
        book: extend(
            {
                language: language ? language : undefined
            },
            variables.toJS()
        )
    };
}

export default encodeBookToJson;
