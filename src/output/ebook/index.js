import extend from "extend";
import WebsiteGenerator from "../website";

export default extend({}, WebsiteGenerator, {
    name: "ebook",
    Options: require("./options").default,
    onPage: require("./onPage").default,
    onFinish: require("./onFinish").default
});
