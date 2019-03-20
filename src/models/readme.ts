import Immutable from "immutable";
import File from "./file";

export interface Readme {
    file: File;
    title: string;
    description: string;
}

/**
    Create a new readme

    @param {File} file
    @param {Object} def
    @return {Readme}
*/
export const createReadme = function(file, def): Readme {
    def = def || {};

    return {
        file: file,
        title: def.title || "",
        description: def.description || ""
    };
};
