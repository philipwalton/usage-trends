import * as types from './types';


/**
 * Returns the UPDATE_OPTIONS action type with the passed params.
 * @param {Object} options
 * @return {Object}
 */
export const updateOptions = (options) => {
  return {type: types.UPDATE_OPTIONS, options};
};
