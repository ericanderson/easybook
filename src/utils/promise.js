import Q from "q";
import Immutable from "immutable";

// Debugging for long stack traces
if (process.env.DEBUG || process.env.CI) {
    Q.longStackSupport = true;
}

/**
 * Reduce an array to a promise
 *
 * @param {Array|List} arr
 * @param {Function(value, element, index)}
 * @return {Promise<Mixed>}
 */
function reduce(arr, iter, base) {
    arr = Immutable.Iterable.isIterable(arr) ? arr : Immutable.List(arr);

    return arr.reduce(
        (prev, elem, key) => prev.then(val => iter(val, elem, key)),
        Q(base)
    );
}

/**
 * Iterate over an array using an async iter
 *
 * @param {Array|List} arr
 * @param {Function(value, element, index)}
 * @return {Promise}
 */
function forEach(arr, iter) {
    return reduce(arr, (val, el, key) => iter(el, key));
}

/**
 * Transform an array
 *
 * @param {Array|List} arr
 * @param {Function(value, element, index)}
 * @return {Promise}
 */
function serie(arr, iter, base) {
    return reduce(
        arr,
        (before, item, key) =>
            Q(iter(item, key)).then(r => {
                before.push(r);
                return before;
            }),
        []
    );
}

/**
 * Iter over an array and return first result (not null)
 *
 * @param {Array|List} arr
 * @param {Function(element, index)}
 * @return {Promise<Mixed>}
 */
function some(arr, iter) {
    arr = Immutable.List(arr);

    return arr.reduce(
        (prev, elem, i) =>
            prev.then(val => {
                if (val) return val;

                return iter(elem, i);
            }),
        Q()
    );
}

/**
 * Map an array using an async (promised) iterator
 *
 * @param {Array|List} arr
 * @param {Function(element, index)}
 * @return {Promise<List>}
 */
function mapAsList(arr, iter) {
    return reduce(
        arr,
        (prev, entry, i) =>
            Q(iter(entry, i)).then(out => {
                prev.push(out);
                return prev;
            }),
        []
    );
}

/**
 * Map an array or map
 *
 * @param {Array|List|Map|OrderedMap} arr
 * @param {Function(element, key)}
 * @return {Promise<List|Map|OrderedMap>}
 */
function map(arr, iter) {
    if (Immutable.Map.isMap(arr)) {
        var type = "Map";
        if (Immutable.OrderedMap.isOrderedMap(arr)) {
            type = "OrderedMap";
        }

        return mapAsList(arr, (value, key) =>
            Q(iter(value, key)).then(result => [key, result])
        ).then(result => Immutable[type](result));
    } else {
        return mapAsList(arr, iter).then(result => Immutable.List(result));
    }
}

/**
 * Wrap a function in a promise
 *
 * @param {Function} func
 * @return {Funciton}
 */
function wrap(func) {
    return function() {
        var args = Array.prototype.slice.call(arguments, 0);

        return Q().then(() => func.apply(null, args));
    };
}

export default Q;
export { forEach };
export { reduce };
export { map };
export { serie };
export { some };
export { wrap as wrapfn };
