import path from "path";
import Immutable from "immutable";
import Logger from "../utils/logger";
import FS from "./fs";
import Config from "./config";
import Readme from "./readme";
import Summary from "./summary";
import Glossary from "./glossary";
import Languages from "./languages";
import Ignore from "./ignore";
import File from "../models/file";

const Book = Immutable.Record({
    // Logger for outptu message
    logger: Logger(),

    // Filesystem binded to the book scope to read files/directories
    fs: FS(),

    // Ignore files parser
    ignore: Ignore(),

    // Structure files
    config: Config(),
    readme: {
        file: File(),
        description: "",
        title: ""
    },
    summary: Summary(),
    glossary: Glossary(),
    languages: Languages(),

    // ID of the language for language books
    language: String(),

    // List of children, if multilingual (String -> Book)
    books: Immutable.OrderedMap()
});

Book.prototype.getLogger = function() {
    return this.get("logger");
};

Book.prototype.getFS = function() {
    return this.get("fs");
};

Book.prototype.getIgnore = function() {
    return this.get("ignore");
};

Book.prototype.getConfig = function() {
    return this.get("config");
};

Book.prototype.getReadme = function() {
    return this.get("readme");
};

Book.prototype.getSummary = function() {
    return this.get("summary");
};

Book.prototype.getGlossary = function() {
    return this.get("glossary");
};

Book.prototype.getLanguages = function() {
    return this.get("languages");
};

Book.prototype.getBooks = function() {
    return this.get("books");
};

Book.prototype.getLanguage = function() {
    return this.get("language");
};

/**
    Return FS instance to access the content

    @return {FS}
*/
Book.prototype.getContentFS = function() {
    const fs = this.getFS();
    const config = this.getConfig();
    const rootFolder = config.getValue("root");

    if (rootFolder) {
        return FS.reduceScope(fs, rootFolder);
    }

    return fs;
};

/**
    Return root of the book

    @return {String}
*/
Book.prototype.getRoot = function() {
    const fs = this.getFS();
    return fs.getRoot();
};

/**
    Return root for content of the book

    @return {String}
*/
Book.prototype.getContentRoot = function() {
    const fs = this.getContentFS();
    return fs.getRoot();
};

/**
    Check if a file is ignore (should not being parsed, etc)

    @param {String} ref
    @return {Page|undefined}
*/
Book.prototype.isFileIgnored = function(filename) {
    const ignore = this.getIgnore();
    const language = this.getLanguage();

    // Ignore is always relative to the root of the main book
    if (language) {
        filename = path.join(language, filename);
    }

    return ignore.isFileIgnored(filename);
};

/**
    Check if a content file is ignore (should not being parsed, etc)

    @param {String} ref
    @return {Page|undefined}
*/
Book.prototype.isContentFileIgnored = function(filename) {
    const config = this.getConfig();
    const rootFolder = config.getValue("root");

    if (rootFolder) {
        filename = path.join(rootFolder, filename);
    }

    return this.isFileIgnored(filename);
};

/**
    Return a page from a book by its path

    @param {String} ref
    @return {Page|undefined}
*/
Book.prototype.getPage = function(ref) {
    return this.getPages().get(ref);
};

/**
    Is this book the parent of language's books

    @return {Boolean}
*/
Book.prototype.isMultilingual = function() {
    return this.getLanguages().getCount() > 0;
};

/**
    Return true if book is associated to a language

    @return {Boolean}
*/
Book.prototype.isLanguageBook = function() {
    return Boolean(this.getLanguage());
};

/**
    Return a languages book

    @param {String} language
    @return {Book}
*/
Book.prototype.getLanguageBook = function(language) {
    const books = this.getBooks();
    return books.get(language);
};

/**
    Add a new language book

    @param {String} language
    @param {Book} book
    @return {Book}
*/
Book.prototype.addLanguageBook = function(language, book) {
    let books = this.getBooks();
    books = books.set(language, book);

    return this.set("books", books);
};

/**
    Set the summary for this book

    @param {Summary}
    @return {Book}
*/
Book.prototype.setSummary = function(summary) {
    return this.set("summary", summary);
};

/**
    Set the readme for this book

    @param {Readme}
    @return {Book}
*/
Book.prototype.setReadme = function(readme) {
    return this.set("readme", readme);
};

/**
    Set the configuration for this book

    @param {Config}
    @return {Book}
*/
Book.prototype.setConfig = function(config) {
    return this.set("config", config);
};

/**
    Set the ignore instance for this book

    @param {Ignore}
    @return {Book}
*/
Book.prototype.setIgnore = function(ignore) {
    return this.set("ignore", ignore);
};

/**
    Change log level

    @param {String} level
    @return {Book}
*/
Book.prototype.setLogLevel = function(level) {
    this.getLogger().setLevel(level);
    return this;
};

/**
    Create a book using a filesystem

    @param {FS} fs
    @return {Book}
*/
Book.createForFS = function createForFS(fs) {
    return new Book({
        fs
    });
};

/**
    Infers the default extension for files
    @return {String}
*/
Book.prototype.getDefaultExt = function() {
    // Inferring sources
    const clues = [this.getReadme(), this.getSummary(), this.getGlossary()];

    // List their extensions
    const exts = clues.map(clue => {
        const file = clue.getFile();
        if (file.exists()) {
            return file
                .getParser()
                .getExtensions()
                .first();
        } else {
            return null;
        }
    });
    // Adds the general default extension
    exts.push(".md");

    // Choose the first non null
    return exts.find(e => e !== null);
};

/**
    Infer the default path for a Readme.
    @param {Boolean} [absolute=false] False for a path relative to
        this book's content root
    @return {String}
*/
Book.prototype.getDefaultReadmePath = function(absolute) {
    const defaultPath = "README" + this.getDefaultExt();
    if (absolute) {
        return path.join(this.getContentRoot(), defaultPath);
    } else {
        return defaultPath;
    }
};

/**
    Infer the default path for a Summary.
    @param {Boolean} [absolute=false] False for a path relative to
        this book's content root
    @return {String}
*/
Book.prototype.getDefaultSummaryPath = function(absolute) {
    const defaultPath = "SUMMARY" + this.getDefaultExt();
    if (absolute) {
        return path.join(this.getContentRoot(), defaultPath);
    } else {
        return defaultPath;
    }
};

/**
    Infer the default path for a Glossary.
    @param {Boolean} [absolute=false] False for a path relative to
        this book's content root
    @return {String}
*/
Book.prototype.getDefaultGlossaryPath = function(absolute) {
    const defaultPath = "GLOSSARY" + this.getDefaultExt();
    if (absolute) {
        return path.join(this.getContentRoot(), defaultPath);
    } else {
        return defaultPath;
    }
};

/**
    Create a language book from a parent

    @param {Book} parent
    @param {String} language
    @return {Book}
*/
Book.createFromParent = function createFromParent(parent, language) {
    const ignore = parent.getIgnore();
    let config = parent.getConfig();

    // Set language in configuration
    config = config.setValue("language", language);

    return new Book({
        // Inherits config. logegr and list of ignored files
        logger: parent.getLogger(),
        config,
        ignore,

        language,
        fs: FS.reduceScope(parent.getContentFS(), language)
    });
};

export default Book;
