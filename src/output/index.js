import Immutable from "immutable";

const generators = Immutable.List([
    require("./json").default,
    require("./website").default,
    require("./ebook").default
]);

/**
    Return a specific generator by its name

    @param {String}
    @return {Generator}
*/
function getGenerator(name) {
    return generators.find(generator => generator.name == name);
}

export default {
    generate: require("./generateBook").default,
    getGenerator
};
