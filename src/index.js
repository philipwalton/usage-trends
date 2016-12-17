import React from 'react';
import {render} from 'react-dom';
import {connect, Provider} from 'react-redux';
import {bindActionCreators} from 'redux';
import actions from './actions';
import App from './components/app.js';
import {getStore} from './store';
import {loadScript} from './utils';


/* global gapi */


/**
 * Maps Redux state to component props
 * @param {Object} state The redux state.
 * @return {Object} The props from the state.
 */
const mapStateToProps = (state) => state;


/**
 * Maps Redux action dispatchers to component props.
 * @param {function} dispatch The redux dispatch function.
 * @return {Object} The props with dispatch actions.
 */
const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(actions, dispatch),
});


const loadJsClientLibrary = () => {
  return new Promise((resolve, reject) => {
    loadScript('https://apis.google.com/js/client:platform.js', (err) => {
      if (err) return reject(err);
      gapi.load('auth2', () => {
        gapi.auth2.init().then(
            // The `auth2.init()` call resolves with an auth instance, but we
            // can't call `resolve(auth)` with it because it has a `.then()`
            // method that resolves to itself, thus creating an infinite loop.
            // Instead we call `resolve()` with nothing, which is OK since
            // handlers can access the auth instance via
            // `gapi.auth2.getAuthInstance()`.
            () => resolve(),
            reject);
      });
    });
  });
};


const preloadGoogleChartLibrary = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = 'https://www.gstatic.com/charts/loader.js';
  document.head.appendChild(link);
};


/**
 * The primary site feature detect. Determines whether polyfills are needed.
 * @return {boolean} True if the browser supports all required features and
 *     no polyfills are needed.
 */
const browserSupportsAllFeatures = () => {
  return !!(window.Promise && window.Symbol);
};


const main = () => {
  Promise.all([getStore(), loadJsClientLibrary()]).then(([store]) => {
    const auth = gapi.auth2.getAuthInstance();

    const UsageTrendsApp =
        connect(mapStateToProps, mapDispatchToProps)(App);

    const renderApp = (() => {
      const container = document.querySelector('#app');
      return () => {
        render(
            <Provider store={store}>
              <UsageTrendsApp />
            </Provider>,
            container);
      };
    })();

    const loadTime = window.performance && window.performance.now();
    const isSignedIn = auth.isSignedIn.get();
    store.dispatch(actions.updateAuth({isSignedIn}));

    auth.isSignedIn.listen((isSignedIn) => {
      store.dispatch(actions.updateAuth({isSignedIn}));
    });

    // Perform an initial render.
    store.subscribe(renderApp);
    renderApp();

    preloadGoogleChartLibrary();
    import('./analytics.js').then((analytics) => {
      analytics.init(store.getState());
      if (loadTime) {
        analytics.trackJsClientLoadTime(loadTime);
      }
    });
  })
  .catch((err) => console.error(err));
};




if (browserSupportsAllFeatures()) {
  // Browsers that support all features run `main()` immediately.
  main();
} else {
  // All other browsers loads polyfills and then run `main()`.
  loadScript('polyfills.js', main);
}
