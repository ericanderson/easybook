import Immutable from "immutable";

var Options = Immutable.Record({
    // Root folder for the output
    root: String(),

    // Prefix for generation
    prefix: String("website"),

    // Use directory index url instead of "index.html"
    directoryIndex: Boolean(true)
});

export default Options;
