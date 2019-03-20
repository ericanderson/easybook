import Immutable from "immutable";
import jsonschema from "jsonschema";
import jsonSchemaDefaults from "json-schema-defaults";
import Promise, { reduce } from "../utils/promise";
import error from "../utils/error";
import mergeDefaults from "../utils/mergeDefaults";

/**
    Validate one plugin for a book and update book's confiration

    @param {Book}
    @param {Plugin}
    @return {Book}
*/
function validatePluginConfig(book, plugin) {
    var config = book.getConfig();
    var packageInfos = plugin.getPackage();

    var configKey = ["pluginsConfig", plugin.getName()].join(".");

    var pluginConfig = config.getValue(configKey, {}).toJS();

    var schema = (packageInfos.get("gitbook") || Immutable.Map()).toJS();
    if (!schema) return book;

    // Normalize schema
    schema.id = "/" + configKey;
    schema.type = "object";

    // Validate and throw if invalid
    var v = new jsonschema.Validator();
    var result = v.validate(pluginConfig, schema, {
        propertyName: configKey
    });

    // Throw error
    if (result.errors.length > 0) {
        throw new error.ConfigurationError(new Error(result.errors[0].stack));
    }

    // Insert default values
    var defaults = jsonSchemaDefaults(schema);
    pluginConfig = mergeDefaults(pluginConfig, defaults);

    // Update configuration
    config = config.setValue(configKey, pluginConfig);

    // Return new book
    return book.set("config", config);
}

/**
    Validate a book configuration for plugins and
    returns an update configuration with default values.

    @param {Book}
    @param {OrderedMap<String:Plugin>}
    @return {Promise<Book>}
*/
function validateConfig(book, plugins) {
    return reduce(
        plugins,
        (newBook, plugin) => validatePluginConfig(newBook, plugin),
        book
    );
}

export default validateConfig;
