export default {
    modifyHTML: require("./modifyHTML").default,
    inlineAssets: require("./inlineAssets").default,

    // HTML transformations
    addHeadingId: require("./addHeadingId").default,
    svgToImg: require("./svgToImg").default,
    fetchRemoteImages: require("./fetchRemoteImages").default,
    svgToPng: require("./svgToPng").default,
    resolveLinks: require("./resolveLinks").default,
    resolveImages: require("./resolveImages").default,
    annotateText: require("./annotateText").default,
    highlightCode: require("./highlightCode").default
};
