import metadata from 'javascript-api-utils/lib/metadata';
import React, {Component} from 'react';
import AlertDispatcher from './alert-dispatcher';
import AggregateChart from './charts/aggregate-chart';
import BreakdownChart from './charts/breakdown-chart';
import Section from './section';
import GoogleSignIn from './google-sign-in';
import RequestForm from './request-form';
import * as trendReport from '../trend-report';


// Styles
import styles from './app.css';


class App extends Component {
  handleViewChange = ({account, property, view}) => {
    const {actions} = this.props;

    actions.updateParams({viewId: view.id});

    getMetrics(account, property, view)
        .then((metrics) => actions.updateOptions({metrics}))
        .catch((err) => this.handleError(err));

    getDimensions(account, property, view)
        .then((dimensions) => actions.updateOptions({dimensions}))
        .catch((err) => this.handleError(err));
  }

  handleParamChange = ({target}) => {
    this.props.actions.updateParams({[target.name]: target.value});
    import('../analytics.js').then((analytics) => {
      analytics.updateParams(target.name, this.props.params);
    });
  }

  submit = (event) => {
    event.preventDefault();

    const {actions} = this.props;
    actions.updateReport({isQuerying: true});

    const params = {...this.props.params};
    trendReport.create(params)
        .then((report) => {
          actions.updateReport({...report, isQuerying: false});
          import('../analytics.js').then((analytics) => {
            analytics.trackCreateReport();
          });
        })
        .catch((err) => {
          actions.updateReport({
            isQuerying: false,
            aggregateRowData: null,
            breakdownRowData: null,
          });

          if (err.code) {
            actions.addAlert({
              title: 'Oops, something went wrong',
              message: `(${err.code}) ${err.message}`,
            });
            import('../analytics.js').then((analytics) => {
              analytics.trackReportError(err);
            });
          } else {
            this.handleError(err);
          }
        });
  }

  handleError(err) {
    this.props.actions.addAlert({
      title: 'Oops, something went wrong',
      message: err.message,
    });
    import('../analytics.js').then((analytics) => analytics.trackError(err));
  }

  render() {
    const {props} = this;
    return (
      <div className={styles.root}>
        <div>
          {props.auth.isSignedIn ? <Section shadow>
            <RequestForm
              actions={props.actions}
              params={props.params}
              options={props.options}
              report={props.report}
              onSubmit={this.submit}
              onViewChange={this.handleViewChange}
              onParamChange={this.handleParamChange} />
          </Section> : <div alt className={styles.signInPrompt}>
            <GoogleSignIn />
            <p className={styles.signInPromptMessage}>
              Usage Trends need permission to access your Google
              Analytics data before it can create trend reports.
            </p>
          </div>}
          {!props.report.aggregateRowData ? null : (
            <Section alt wide center nogap>
              <section>
                <h2>Results</h2>
                <p>
                  The first chart below shows how each dimension in the
                  results compares to each other. Below that is a breakdown
                  chart for each individual dimension along with a trend line.
                </p>
              </section>
              <AggregateChart dataset={props.report.aggregateRowData} />
              <h3 className={styles.h3}>Results breakdown</h3>
              {props.report.breakdownRowData &&
                  Object.keys(props.report.breakdownRowData).map((key, i) => (
                <BreakdownChart
                  title={key}
                  key={key}
                  index={i}
                  dataset={props.report.breakdownRowData[key]} />
              ))}
            </Section>
          )}
        </div>
        <AlertDispatcher
          alerts={props.alerts}
          onRemove={props.actions.removeAlert} />
      </div>
    );
  }
}

export default App;


/**
 * Gets a list of all public, v3 metrics associated with the passed view.
 * @param {Object} account An account object from the Metadata API.
 * @param {Object} property A property object from the Metadata API.
 * @param {Object} view A view object from the Metadata API.
 * @return {Promise} A promise resolved with an array of all public metrics.
 */
function getMetrics(account, property, view) {
  return metadata.getAuthenticated(account, property, view).then((columns) => {
    const metrics = columns.allMetrics((metric, id) => {
      // TODO(philipwalton): remove this temporary inclusion once the new
      // ga:uniqueEvents metric is no longer listed as deprecated in the API.
      if (id == 'ga:uniqueEvents') {
        metric.uiName = 'Unique Events';
        return true;
      }

      // TODO(philipwalton): remove this temporary exclusion once
      // caclulated metrics can be templatized using the Management API.
      if (id == 'ga:calcMetric_<NAME>') return false;

      // Calculated (or non-totalable) metrics are excluded because there's
      // no concept of a "total" to divide by.
      if (metric.calculation) return false;

      // Else, return true if the metric is public.
      return metric.status == 'PUBLIC';
    });

    const groups = {};
    for (const metric of metrics) {
      const {group} = metric.attributes;
      groups[group] = groups[group] || [];
      groups[group].push(metric);
    }
    return groups;
  });
}


/**
 * Gets a list of all public, v3 dimensions associated with the passed view.
 * @param {Object} account An account object from the Metadata API.
 * @param {Object} property A property object from the Metadata API.
 * @param {Object} view A view object from the Metadata API.
 * @return {Promise} A promise resolved with an array of all public dimensions.
 */
function getDimensions(account, property, view) {
  return metadata.getAuthenticated(account, property, view).then((columns) => {
    const dimensions = columns.allDimensions({status: 'PUBLIC'});

    const groups = {};
    for (const dimension of dimensions) {
      const {group} = dimension.attributes;
      groups[group] = groups[group] || [];
      groups[group].push(dimension);
    }
    return groups;
  });
}
