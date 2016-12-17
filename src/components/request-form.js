import React, {Component} from 'react';
import ParamSelector from './param-selector';
import ViewSelector from './view-selector';

// Styles
import requestFormStyles from './request-form.css';
import buttonStyles from '../styles/button.css';


export default class RequestForm extends Component {
  render() {
    const {props} = this;

    return (
      <form className={requestFormStyles.form} onSubmit={props.onSubmit}>
        <div className={requestFormStyles.fieldGroups}>
          <div className={requestFormStyles.fieldGroup}>
            <h3 className={requestFormStyles.h3}>
              1. Select a Google Analytics view
            </h3>
            <ViewSelector
              viewId={props.params.viewId}
              actions={props.actions}
              onChange={props.onViewChange} />
          </div>
          <div className={requestFormStyles.fieldGroup}>
            <h3 className={requestFormStyles.h3}>
              2. Choose your query parameters
            </h3>
            <ParamSelector
              onChange={props.onParamChange}
              params={props.params}
              options={props.options} />
          </div>
        </div>
        <div className={requestFormStyles.examples}>
          <p><b>Not sure which parameters to choose? </b>Try one of the
          suggested reports below. Just click the link to update the query
          parameters, then click "Create trend report".</p>
          <ul className={requestFormStyles.exampleList}>
            <li>
              <button
                type="button"
                data-on="click"
                data-event-category="Presets"
                data-event-action="click"
                data-event-label="ga:sessions/ga:deviceCategory"
                onClick={props.actions.updateParams.bind(null, {
                  metric: 'ga:sessions',
                  dimension: 'ga:deviceCategory',
                })}>
                Desktop/mobile usage
              </button>
            </li>
            <li>
              <button
                type="button"
                data-on="click"
                data-event-category="Presets"
                data-event-action="click"
                data-event-label="ga:sessions/ga:browser"
                onClick={props.actions.updateParams.bind(null, {
                  metric: 'ga:sessions',
                  dimension: 'ga:browser',
                })}>
                Browser usage
              </button>
            </li>
            <li>
              <button
                type="button"
                data-on="click"
                data-event-category="Presets"
                data-event-action="click"
                data-event-label="ga:sessions/ga:country"
                onClick={props.actions.updateParams.bind(null, {
                  metric: 'ga:sessions',
                  dimension: 'ga:country',
                })}>
                Usage by country
              </button>
            </li>
            <li>
              <button
                type="button"
                data-on="click"
                data-event-category="Presets"
                data-event-action="click"
                data-event-label="ga:sessions/ga:userType"
                onClick={props.actions.updateParams.bind(null, {
                  metric: 'ga:sessions',
                  dimension: 'ga:userType',
                })}>
                New/returning users
              </button>
            </li>
          </ul>
        </div>
        <div className={requestFormStyles.submit}>
          <button
            disabled={props.report.isQuerying}
            className={[buttonStyles.root, buttonStyles._big].join(' ')}>
            {props.report.isQuerying ? 'Loading...' : 'Create trend report'}
          </button>
        </div>
      </form>
    );
  }
}
