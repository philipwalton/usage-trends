import * as types from './types';


/**
 * Returns the ADD_ALERT action type with the passed params.
 * @param {Array} alert
 * @return {Object}
 */
export const addAlert = (alert) => {
  return {type: types.ADD_ALERT, alert};
};


/**
 * Returns the REMOVE_ALERT action type with the passed params.
 * @param {Array} alert
 * @return {Object}
 */
export const removeAlert = (alert) => {
  return {type: types.REMOVE_ALERT, alert};
};

