import * as types from '../actions/types';


/**
 * Updates the params state tree.
 * @param {Object} state
 * @param {Object} action
 * @return {Array} The updated state.
 */
export default function params(state = {}, action) {
  switch (action.type) {
    case types.UPDATE_PARAMS:
      return {...state, ...action.params};
    default:
      return state;
  }
}
