import path from "path";
import chokidar from "chokidar";
import Promise from "../utils/promise";
import parsers from "../parsers";

/**
    Watch a folder and resolve promise once a file is modified

    @param {String} dir
    @return {Promise}
*/
function watch(dir) {
    var d = Promise.defer();
    dir = path.resolve(dir);

    var toWatch = ["book.json", "book.js", "_layouts/**"];

    // Watch all parsable files
    parsers.extensions.forEach(function(ext) {
        toWatch.push("**/*" + ext);
    });

    var watcher = chokidar.watch(toWatch, {
        cwd: dir,
        ignored: "_book/**",
        ignoreInitial: true
    });

    watcher.once("all", function(e, filepath) {
        watcher.close();

        d.resolve(filepath);
    });
    watcher.once("error", function(err) {
        watcher.close();

        d.reject(err);
    });

    return d.promise;
}

export default watch;
