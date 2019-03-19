import path from "path";
import Immutable from "immutable";
import fresh from "fresh-require";
import fs from "../utils/fs";
import FS from "../models/fs";

function fsReadDir(folder) {
    return fs.readdir(folder).then(function(files) {
        files = Immutable.List(files);

        return files
            .map(function(file) {
                if (file == "." || file == "..") return;

                var stat = fs.statSync(path.join(folder, file));
                if (stat.isDirectory()) file = file + path.sep;
                return file;
            })
            .filter(function(file) {
                return Boolean(file);
            });
    });
}

function fsLoadObject(filename) {
    return fresh(filename, require);
}

export default function createNodeFS(root) {
    return FS.create({
        root: root,

        fsExists: fs.exists,
        fsReadFile: fs.readFile,
        fsStatFile: fs.stat,
        fsReadDir: fsReadDir,
        fsLoadObject: fsLoadObject,
        fsReadAsStream: fs.readStream
    });
};
