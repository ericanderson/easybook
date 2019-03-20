import is from "is";
import mergeAtLevel from "./mergeAtLevel";
import indexArticleLevels from "./indexArticleLevels";

/**
    Remove an article from a level.

    @param {Summary} summary
    @param {String|SummaryArticle} level: level to remove
    @return {Summary}
*/
function removeArticle(summary, level) {
    // Coerce to level
    level = is.string(level) ? level : level.getLevel();

    var parent = summary.getParent(level);

    var articles = parent.getArticles();
    // Find the index to remove
    var index = articles.findIndex(art => {
        return art.getLevel() === level;
    });
    if (index === -1) {
        return summary;
    }

    // Remove from children
    articles = articles.remove(index);
    parent = parent.set("articles", articles);

    // Reindex the level from here
    parent = indexArticleLevels(parent);

    return mergeAtLevel(summary, parent.getLevel(), parent);
}

export default removeArticle;
