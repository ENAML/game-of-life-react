/**
 * util fns
 * ========
 */

// returns if value is null or not
export const isNull = (val) => (val == null);

// generator for ranges
// ex 1: `for (let i of range(0, 10)) { ... }
// ex 2: `const arr = [...range(5, 10)];
export const range = function* (lo, hi) {
    if (isNaN(lo) || isNaN(hi)) {
        throw new Error(`invalid inputs`)
    }

    for (let i = lo; i < hi; i++) {
        yield i;
    }
};