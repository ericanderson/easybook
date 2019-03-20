import Promise from "./promise";
import command from "./command";
import fs from "./fs";
import error from "./error";

// Convert a svg file to a pmg
function convertSVGToPNG(source, dest, options) {
    if (!fs.existsSync(source))
        return Promise.reject(
            new error.FileNotFoundError({ filename: source })
        );

    return command
        .spawn("svgexport", [source, dest])
        .fail(err => {
            if (err.code == "ENOENT") {
                err = error.RequireInstallError({
                    cmd: "svgexport",
                    install: 'Install it using: "npm install svgexport -g"'
                });
            }
            throw err;
        })
        .then(() => {
            if (fs.existsSync(dest)) return;

            throw new Error("Error converting " + source + " into " + dest);
        });
}

// Convert a svg buffer to a png file
function convertSVGBufferToPNG(buf, dest) {
    // Create a temporary SVG file to convert
    return fs
        .tmpFile({
            postfix: ".svg"
        })
        .then(tmpSvg =>
            fs.writeFile(tmpSvg, buf).then(() => convertSVGToPNG(tmpSvg, dest))
        );
}

// Converts a inline data: to png file
function convertInlinePNG(source, dest) {
    if (!/^data\:image\/png/.test(source))
        return Promise.reject(new Error("Source is not a PNG data-uri"));

    var base64data = source.split("data:image/png;base64,")[1];
    var buf = new Buffer(base64data, "base64");

    return fs.writeFile(dest, buf).then(() => {
        if (fs.existsSync(dest)) return;

        throw new Error("Error converting " + source + " into " + dest);
    });
}

export default {
    convertSVGToPNG: convertSVGToPNG,
    convertSVGBufferToPNG: convertSVGBufferToPNG,
    convertInlinePNG: convertInlinePNG
};
