/**
 * @module core/service/utils/types
 */

 import lodash from 'lodash';

 const isObject = lodash.isObject;
 const isPlainObject = lodash.isPlainObject;
 const isEmpty = lodash.isEmpty;
 const isRegExp = lodash.isRegExp;
 const isArray = lodash.isArray;
 const isFunction = lodash.isFunction;
 const isDate = lodash.isDate;
 const isString = lodash.isString;
 const isBoolean = lodash.isBoolean;
 const isEqual = lodash.isEqual;
 const isNumber = lodash.isNumber;

export default {
    isObject,
    isPlainObject,
    isEmpty,
    isRegExp,
    isArray,
    isFunction,
    isDate,
    isString,
    isBoolean,
    isEqual,
    isNumber,
    isUndefined
};


/**
 * Checks if a value is undefined
 *
 * @param {*} value
 * @returns {Boolean}
 */
export function isUndefined(value) {
    return typeof value === 'undefined';
}
