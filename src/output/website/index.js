export default {
    name: "website",
    State: require("./state").default,
    Options: require("./options").default,
    onInit: require("./onInit").default,
    onFinish: require("./onFinish").default,
    onPage: require("./onPage").default,
    onAsset: require("./onAsset").default,
    createTemplateEngine: require("./createTemplateEngine").default
};
