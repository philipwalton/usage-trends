import * as types from './types';


/**
 * Returns the UPDATE_AUTH action type with the passed params.
 * @param {Object} auth
 * @return {Object}
 */
export const updateAuth = (auth) => {
  return {type: types.UPDATE_AUTH, auth};
};
