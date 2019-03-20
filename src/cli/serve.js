/* eslint-disable no-console */

import tinylr from "tiny-lr";

import open from "open";
import Parse from "../parse";
import Output from "../output";
import {Config as ConfigModifier} from "../modifiers";
import Promise from "../utils/promise";
import options from "./options";
import getBook from "./getBook";
import getOutputFolder from "./getOutputFolder";
import Server from "./server";
import watch from "./watch";

var server, lrServer, lrPath;

function waitForCtrlC() {
    var d = Promise.defer();

    process.on("SIGINT", function() {
        d.resolve();
    });

    return d.promise;
}

function generateBook(args, kwargs) {
    var port = kwargs.port;
    var outputFolder = getOutputFolder(args);
    var book = getBook(args, kwargs);
    var Generator = Output.getGenerator(kwargs.format);
    var browser = kwargs["browser"];

    var hasWatch = kwargs["watch"];
    var hasLiveReloading = kwargs["live"];
    var hasOpen = kwargs["open"];

    // Stop server if running
    if (server.isRunning()) console.log("Stopping server");

    return server
        .stop()
        .then(function() {
            return Parse.parseBook(book).then(function(resultBook) {
                if (hasLiveReloading) {
                    // Enable livereload plugin
                    var config = resultBook.getConfig();
                    config = ConfigModifier.addPlugin(config, "livereload");
                    resultBook = resultBook.set("config", config);
                }

                return Output.generate(Generator, resultBook, {
                    root: outputFolder
                });
            });
        })
        .then(function() {
            console.log();
            console.log("Starting server ...");
            return server.start(outputFolder, port);
        })
        .then(function() {
            console.log("Serving book on http://localhost:" + port);

            if (lrPath && hasLiveReloading) {
                // trigger livereload
                lrServer.changed({
                    body: {
                        files: [lrPath]
                    }
                });
            }

            if (hasOpen) {
                open("http://localhost:" + port, browser);
            }
        })
        .then(function() {
            if (!hasWatch) {
                return waitForCtrlC();
            }

            return watch(book.getRoot()).then(function(filepath) {
                // set livereload path
                lrPath = filepath;
                console.log("Restart after change in file", filepath);
                console.log("");
                return generateBook(args, kwargs);
            });
        });
}

export default {
    name: "serve [book] [output]",
    description: "serve the book as a website for testing",
    options: [
        {
            name: "port",
            description: "Port for server to listen on",
            defaults: 4000
        },
        {
            name: "lrport",
            description: "Port for livereload server to listen on",
            defaults: 35729
        },
        {
            name: "watch",
            description: "Enable file watcher and live reloading",
            defaults: true
        },
        {
            name: "live",
            description: "Enable live reloading",
            defaults: true
        },
        {
            name: "open",
            description: "Enable opening book in browser",
            defaults: false
        },
        {
            name: "browser",
            description: "Specify browser for opening book",
            defaults: ""
        },
        options.log,
        options.format
    ],
    exec: function(args, kwargs) {
        server = new Server();
        var hasWatch = kwargs["watch"];
        var hasLiveReloading = kwargs["live"];

        return Promise()
            .then(function() {
                if (!hasWatch || !hasLiveReloading) {
                    return;
                }

                lrServer = tinylr({});
                return Promise.nfcall(
                    lrServer.listen.bind(lrServer),
                    kwargs.lrport
                ).then(function() {
                    console.log(
                        "Live reload server started on port:",
                        kwargs.lrport
                    );
                    console.log("Press CTRL+C to quit ...");
                    console.log("");
                });
            })
            .then(function() {
                return generateBook(args, kwargs);
            });
    }
};
