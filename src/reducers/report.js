import * as types from '../actions/types';


/**
 * Updates the report state tree.
 * @param {Object} state
 * @param {Object} action
 * @return {Array} The updated state.
 */
export default function report(state = {}, action) {
  switch (action.type) {
    case types.UPDATE_REPORT:
      return {...state, ...action.report};
    default:
      return state;
  }
}
