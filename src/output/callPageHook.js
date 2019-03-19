import Api from "../api";
import callHook from "./callHook";

/**
    Call a hook for a specific page

    @param {String} name
    @param {Output} output
    @param {Page} page
    @return {Promise<Page>}
*/
function callPageHook(name, output, page) {
    return callHook(
        name,

        function(out) {
            return Api.encodePage(out, page);
        },

        function(out, result) {
            return Api.decodePage(out, page, result);
        },

        output
    );
}

export default callPageHook;
