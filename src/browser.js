import Modifiers from "./modifiers";

export default {
    Parse: require("./parse").default,

    // Models
    Book: require("./models/book").default,
    FS: require("./models/fs").default,
    File: require("./models/file").default,
    Summary: require("./models/summary").default,
    Glossary: require("./models/glossary").default,
    Config: require("./models/config").default,
    Page: require("./models/page").default,
    PluginDependency: require("./models/pluginDependency").default,

    // Modifiers
    SummaryModifier: Modifiers.Summary,
    ConfigModifier: Modifiers.Config,

    // Constants
    CONFIG_FILES: require("./constants/configFiles.js").default,
    IGNORE_FILES: require("./constants/ignoreFiles.js").default,
    DEFAULT_PLUGINS: require("./constants/defaultPlugins").default,
    EXTENSIONS_MARKDOWN: require("./constants/extsMarkdown").default,
    EXTENSIONS_ASCIIDOC: require("./constants/extsAsciidoc").default
};
