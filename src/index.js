import extend from "extend";
import common from "./browser";

export default extend(
    {
        initBook: require("./init").default,
        createNodeFS: require("./fs/node").default,
        Output: require("./output").default,
        commands: require("./cli").default
    },
    common
);
