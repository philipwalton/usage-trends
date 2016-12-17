import * as types from './types';


/**
 * Returns the UPDATE_PARAMS action type with the passed params.
 * @param {Object} params
 * @return {Object}
 */
export const updateParams = (params) => {
  return {type: types.UPDATE_PARAMS, params};
};
