import Immutable from "immutable";
import location from "../utils/location";

/*
    An article represents an entry in the Summary / table of Contents
*/

const SummaryArticle = Immutable.Record(
    {
        level: String(),
        title: String(),
        ref: String(),
        articles: Immutable.List()
    },
    "SummaryArticle"
);

SummaryArticle.prototype.getLevel = function() {
    return this.get("level");
};

SummaryArticle.prototype.getTitle = function() {
    return this.get("title");
};

SummaryArticle.prototype.getRef = function() {
    return this.get("ref");
};

SummaryArticle.prototype.getArticles = function() {
    return this.get("articles");
};

/**
 * Return how deep the article is.
 * The README has a depth of 1
 *
 * @return {Number}
 */
SummaryArticle.prototype.getDepth = function() {
    return this.getLevel().split(".").length - 1;
};

/**
 * Get path (without anchor) to the pointing file.
 * It also normalizes the file path.
 *
 * @return {String}
 */
SummaryArticle.prototype.getPath = function() {
    if (this.isExternal()) {
        return undefined;
    }

    const ref = this.getRef();
    if (!ref) {
        return undefined;
    }

    const parts = ref.split("#");

    const pathname = parts.length > 1 ? parts.slice(0, -1).join("#") : ref;

    // Normalize path to remove ('./', '/...', etc)
    return location.flatten(pathname);
};

/**
 * Return url if article is external
 *
 * @return {String}
 */
SummaryArticle.prototype.getUrl = function() {
    return this.isExternal() ? this.getRef() : undefined;
};

/**
 * Get anchor for this article (or undefined)
 *
 * @return {String}
 */
SummaryArticle.prototype.getAnchor = function() {
    const ref = this.getRef();
    const parts = ref.split("#");

    const anchor = parts.length > 1 ? `#${parts[parts.length - 1]}` : undefined;
    return anchor;
};

/**
 * Create a new level for a new child article
 *
 * @return {String}
 */
SummaryArticle.prototype.createChildLevel = function() {
    const level = this.getLevel();
    const subArticles = this.getArticles();
    const childLevel = `${level}.${subArticles.size + 1}`;

    return childLevel;
};

/**
 * Is article pointing to a page of an absolute url
 *
 * @return {Boolean}
 */
SummaryArticle.prototype.isPage = function() {
    return !this.isExternal() && this.getRef();
};

/**
 * Check if this article is a file (exatcly)
 *
 * @param {File} file
 * @return {Boolean}
 */
SummaryArticle.prototype.isFile = function(file) {
    return file.getPath() === this.getPath() && this.getAnchor() === undefined;
};

/**
 * Check if this article is the introduction of the book
 *
 * @param {Book|Readme} book
 * @return {Boolean}
 */
SummaryArticle.prototype.isReadme = function(book) {
    const readme = book.getFile ? book : book.getReadme();
    const file = readme.file;

    return this.isFile(file);
};

/**
 * Is article pointing to aan absolute url
 *
 * @return {Boolean}
 */
SummaryArticle.prototype.isExternal = function() {
    return location.isExternal(this.getRef());
};

/**
 * Create a SummaryArticle
 *
 * @param {Object} def
 * @return {SummaryArticle}
 */
SummaryArticle.create = (def, level) => {
    const articles = (def.articles || []).map((article, i) => {
        if (article instanceof SummaryArticle) {
            return article;
        }
        return SummaryArticle.create(article, [level, i + 1].join("."));
    });

    return new SummaryArticle({
        level,
        title: def.title,
        ref: def.ref || def.path || "",
        articles: Immutable.List(articles)
    });
};

/**
 * Find an article from a base one
 *
 * @param {Article|Part} base
 * @param {Function(article)} iter
 * @return {Article}
 */
SummaryArticle.findArticle = (base, iter) => {
    const articles = base.getArticles();

    return articles.reduce((result, article) => {
        if (result) return result;

        if (iter(article)) {
            return article;
        }

        return SummaryArticle.findArticle(article, iter);
    }, null);
};

export default SummaryArticle;
