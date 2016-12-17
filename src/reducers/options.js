import * as types from '../actions/types';


/**
 * Updates the options state tree.
 * @param {Object} state
 * @param {Object} action
 * @return {Array} The updated state.
 */
export default function options(state = {}, action) {
  switch (action.type) {
    case types.UPDATE_OPTIONS:
      return {...state, ...action.options};
    default:
      return state;
  }
}
