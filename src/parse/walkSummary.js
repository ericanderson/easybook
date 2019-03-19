import Promise, {forEach} from "../utils/promise";

/**
    Walk over a list of articles

    @param {List<Article>} articles
    @param {Function(article)}
    @return {Promise}
*/
function walkArticles(articles, fn) {
    return forEach(articles, function(article) {
        return Promise(fn(article)).then(function() {
            return walkArticles(article.getArticles(), fn);
        });
    });
}

/**
    Walk over summary and execute "fn" on each article

    @param {Summary} summary
    @param {Function(article)}
    @return {Promise}
*/
function walkSummary(summary, fn) {
    var parts = summary.getParts();

    return forEach(parts, function(part) {
        return walkArticles(part.getArticles(), fn);
    });
}

export default walkSummary;
