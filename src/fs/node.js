import path from "path";
import Immutable from "immutable";
import fresh from "fresh-require";
import fs from "../utils/fs";
import FS from "../models/fs";

function fsReadDir(folder) {
    return fs.readdir(folder).then(files => {
        files = Immutable.List(files);

        return files
            .map(file => {
                if (file == "." || file == "..") return;

                const stat = fs.statSync(path.join(folder, file));
                if (stat.isDirectory()) file = file + path.sep;
                return file;
            })
            .filter(file => Boolean(file));
    });
}

function fsLoadObject(filename) {
    return fresh(filename, require);
}

export default function createNodeFS(root) {
    return FS.create({
        root,

        fsExists: fs.exists,
        fsReadFile: fs.readFile,
        fsStatFile: fs.stat,
        fsReadDir,
        fsLoadObject,
        fsReadAsStream: fs.readStream
    });
}
