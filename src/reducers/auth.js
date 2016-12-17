import * as types from '../actions/types';


/**
 * Updates the auth state tree.
 * @param {Object} state
 * @param {Object} action
 * @return {Array} The updated state.
 */
export default function auth(state = false, action) {
  switch (action.type) {
    case types.UPDATE_AUTH:
      return {...state, ...action.auth};
    default:
      return state;
  }
}
