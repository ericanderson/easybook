import Logger from "../utils/logger";

const logOptions = {
    name: "log",
    description: "Minimum log level to display",
    values: Logger.LEVELS.keySeq()
        .map(s => s.toLowerCase())
        .toJS(),
    defaults: "debug"
};

const formatOption = {
    name: "format",
    description: "Format to build to",
    values: ["website", "json", "ebook"],
    defaults: "website"
};

const timingOption = {
    name: "timing",
    description: "Print timing debug information",
    defaults: false
};

export default {
    log: logOptions,
    format: formatOption,
    timing: timingOption
};
