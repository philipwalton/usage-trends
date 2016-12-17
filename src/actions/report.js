import * as types from './types';


/**
 * Returns the UPDATE_REPORT action type with the passed params.
 * @param {Object} report
 * @return {Object}
 */
export const updateReport = (report) => {
  return {type: types.UPDATE_REPORT, report};
};
