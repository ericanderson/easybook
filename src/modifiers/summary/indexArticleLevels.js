/**
    Index levels in an article tree

    @param {Article}
    @param {String} baseLevel
    @return {Article}
*/
function indexArticleLevels(article, baseLevel = article.getLevel()) {
    let articles = article.getArticles();

    articles = articles.map((inner, i) =>
        indexArticleLevels(inner, `${baseLevel}.${i + 1}`)
    );

    return article.merge({
        level: baseLevel,
        articles
    });
}

export default indexArticleLevels;
