import idb from 'idb-keyval';
import {createStore, applyMiddleware} from 'redux';
import reducer from './reducers';


const IDB_KEY = 'usage-trends';


const getDefaults = (params) => {
  return {
    auth: {isSignedIn: false},
    options: {},
    params: params ? params : {
      dateRange: 365,
      dimension: 'ga:sourceMedium',
      maxResults: 5,
      metric: 'ga:sessions',
    },
    report: {},
  };
};

// delete window.indexedDB;


/**
 * Gets the initial redux state tree from local storage.
 * @return {Object} The state object.
 */
function getInitialState() {
  return idb.get(IDB_KEY)
      .then((params) => getDefaults(params))
      .catch(() => getDefaults());
}


export const getStore = () => {
  return getInitialState().then((state) => {
    let middlewear = [];

    // Adds a logger in non-production mode.
    if (process.env.NODE_ENV != 'production') {
      // Uses `require` here instead of `import` so the module isn't included
      // in the production build.
      middlewear.push(require('redux-logger')());
    }

    let createStoreWithMiddleware = applyMiddleware(...middlewear)(createStore);
    let store = createStoreWithMiddleware(reducer, state);
    store.subscribe(() => idb.set(IDB_KEY, store.getState().params));

    return store;
  });
};
