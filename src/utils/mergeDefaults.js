import Immutable from "immutable";

/**
 * Merge
 * @param  {Object|Map} obj
 * @param  {Object|Map} src
 * @return {Object}
 */
function mergeDefaults(obj, src) {
    var objValue = Immutable.fromJS(obj);
    var srcValue = Immutable.fromJS(src);

    return srcValue.mergeDeep(objValue).toJS();
}

export default mergeDefaults;
