import semver from "semver";
import pkg from "../package.json";

var VERSION = pkg.version;
var VERSION_STABLE = VERSION.replace(/\-(\S+)/g, "");

var START_TIME = new Date();

/**
    Verify that this gitbook version satisfies a requirement
    We can't directly use samver.satisfies since it will break all plugins when gitbook version is a prerelease (beta, alpha)

    @param {String} condition
    @return {Boolean}
*/
function satisfies(condition) {
    // Test with real version
    if (semver.satisfies(VERSION, condition)) return true;

    // Test with future stable release
    return semver.satisfies(VERSION_STABLE, condition);
}

export default {
    version: pkg.version,
    satisfies,
    START_TIME
};
