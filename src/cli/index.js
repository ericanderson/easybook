import buildEbook from "./buildEbook";

export default [
    require("./build").default,
    require("./serve").default,
    require("./install").default,
    require("./parse").default,
    require("./init").default,
    buildEbook("pdf"),
    buildEbook("epub"),
    buildEbook("mobi")
];
