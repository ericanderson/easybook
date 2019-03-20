import Logger from "../utils/logger";

var logOptions = {
    name: "log",
    description: "Minimum log level to display",
    values: Logger.LEVELS.keySeq()
        .map(s => {
            return s.toLowerCase();
        })
        .toJS(),
    defaults: "debug"
};

var formatOption = {
    name: "format",
    description: "Format to build to",
    values: ["website", "json", "ebook"],
    defaults: "website"
};

var timingOption = {
    name: "timing",
    description: "Print timing debug information",
    defaults: false
};

export default {
    log: logOptions,
    format: formatOption,
    timing: timingOption
};
