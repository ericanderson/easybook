import Immutable from "immutable";
import encodeNavigation from "./encodeNavigation";

/**
    page.progress is a deprecated property from GitBook v2

    @param {Output}
    @param {Page}
    @return {Object}
*/
function encodeProgress(output, page) {
    var current = page.getPath();
    var navigation = encodeNavigation(output);
    navigation = Immutable.Map(navigation);

    var n = navigation.size;
    var percent = 0;
    var prevPercent = 0;
    var currentChapter = null;
    var done = true;

    var chapters = navigation
        .map((nav, chapterPath) => {
            nav.path = chapterPath;
            return nav;
        })
        .valueSeq()
        .sortBy(nav => nav.index)
        .map((nav, i) => {
            // Calcul percent
            nav.percent = (i * 100) / Math.max(n - 1, 1);

            // Is it done
            nav.done = done;
            if (nav.path == current) {
                currentChapter = nav;
                percent = nav.percent;
                done = false;
            } else if (done) {
                prevPercent = nav.percent;
            }

            return nav;
        })
        .toJS();

    return {
        // Previous percent
        prevPercent,

        // Current percent
        percent,

        // List of chapter with progress
        chapters,

        // Current chapter
        current: currentChapter
    };
}

export default encodeProgress;
