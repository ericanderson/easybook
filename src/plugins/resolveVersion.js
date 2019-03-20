import npm from "npm";
import semver from "semver";
import Immutable from "immutable";
import Promise from "../utils/promise";
import Plugin from "../models/plugin";
import gitbook from "../gitbook";

var npmIsReady;

/**
    Initialize and prepare NPM

    @return {Promise}
*/
function initNPM() {
    if (npmIsReady) return npmIsReady;

    npmIsReady = Promise.nfcall(npm.load, {
        silent: true,
        loglevel: "silent"
    });

    return npmIsReady;
}

/**
    Resolve a plugin dependency to a version

    @param {PluginDependency} plugin
    @return {Promise<String>}
*/
function resolveVersion(plugin) {
    var npmId = Plugin.nameToNpmID(plugin.getName());
    var requiredVersion = plugin.getVersion();

    if (plugin.isGitDependency()) {
        return Promise.resolve(requiredVersion);
    }

    return initNPM()
        .then(() =>
            Promise.nfcall(
                npm.commands.view,
                [npmId + "@" + requiredVersion, "engines"],
                true
            )
        )
        .then(versions => {
            versions = Immutable.Map(versions).entrySeq();

            var result = versions
                .map(entry => ({
                    version: entry[0],
                    gitbook: (entry[1].engines || {}).gitbook
                }))
                .filter(v => v.gitbook && gitbook.satisfies(v.gitbook))
                .sort((v1, v2) => (semver.lt(v1.version, v2.version) ? 1 : -1))
                .get(0);

            if (!result) {
                return undefined;
            } else {
                return result.version;
            }
        });
}

export default resolveVersion;
