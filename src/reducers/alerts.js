import * as types from '../actions/types';


/**
 * Updates the alerts state tree.
 * @param {Array} state
 * @param {Object} action
 * @return {Array} The updated state.
 */
export default function alerts(state = [], action) {
  switch (action.type) {
    case types.ADD_ALERT:
      return [...state, action.alert];
    case types.REMOVE_ALERT:
      return state.filter((alert) => {
        return alert.title != action.alert.title &&
            alert.message != action.alert.message;
      });
    default:
      return state;
  }
}
