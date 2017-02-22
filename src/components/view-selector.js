import accountSummaries from 'javascript-api-utils/lib/account-summaries';
import React, {Component} from 'react';
import FormControl from './form-control';

// Styles
import styles from './view-selector.css';
import formField from '../styles/form-field.css';


export default class ViewSelector extends Component {
  state = {};

  componentDidMount() {
    // The component should not be mounted unless the user is signed in.
    accountSummaries.get({ignoreEmpty: true}).then((summaries) => {
      this.summaries = summaries;
      const accounts = summaries.allAccounts();

      if (!accounts.length) {
        import('../analytics').then((analytics) => {
          analytics.trackNoGoogleAnalyticsAccounts();
        });
        this.props.actions.addAlert({
          title: `You don't have any Google Analytics accounts`,
          message: `To use this tool you need to have read-access to
                    at least one Google Analytics account.`,
        });
        return;
      }

      if (this.props.viewId) {
        this.setSelectedView(this.props.viewId);
      } else {
        this.setSelectedView(accounts[0].properties[0].views[0].id);
      }
    });
  }

  setSelectedView = (viewId) => {
    const {summaries} = this;
    const accounts = summaries.allAccounts();
    const account = summaries.getAccountByViewId(viewId);
    const properties = account.properties;
    const property = summaries.getPropertyByViewId(viewId);
    const views = property.views;
    const view = summaries.getView(viewId);

    this.setState({
      accounts,
      account,
      properties,
      property,
      views,
      view,
    });
  }

  handleAccountChange = ({target}) => {
    const account = this.summaries.getAccount(target.value);
    this.setSelectedView(account.properties[0].views[0].id);
  }

  handlePropertyChange = ({target}) => {
    const property = this.summaries.getProperty(target.value);
    this.setSelectedView(property.views[0].id);
  }

  handleViewChange = ({target}) => {
    const view = this.summaries.getView(target.value);
    this.setSelectedView(view.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.viewId != this.props.viewId) {
      this.setSelectedView(nextProps.viewId);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const viewId = this.state.view && this.state.view.id;
    const nextViewId = nextState.view && nextState.view.id;

    if (nextViewId != viewId) {
      const {account, property, view} = nextState;
      this.props.onChange({account, property, view});
    }
  }

  render() {
    if (this.state.hasNoViews) {
      return (
        <p>Oops, you don't appear to have any Google Analytics accounts, you
        can sign up for an account at <a href="https://google.com/analytics">
        google.com/analytics</a></p>
      );
    } else {
      const {accounts, account, properties, property, views, view} = this.state;

      return (
        <div className={styles.root}>
          <div className={styles.item}>
            <FormControl full label="Account">
              {accounts && <select
                className={formField.root}
                onChange={this.handleAccountChange}
                value={account.id}>
                {accounts.map((account, i) => (
                  <option key={i} value={account.id}>{account.name}</option>
                ))}
              </select>}
            </FormControl>
          </div>

          <div className={styles.item}>
            <FormControl full label="Property">
              {properties && <select
                className={formField.root}
                onChange={this.handlePropertyChange}
                value={property.id}>
                {properties.map((property, i) => (
                  <option key={i} value={property.id}>{property.name}</option>
                ))}
              </select>}
            </FormControl>
          </div>

          <div className={styles.item}>
            <FormControl full label="View">
              {views && <select
                className={formField.root}
                onChange={this.handleViewChange}
                value={view.id}>
                {views.map((view, i) => (
                  <option key={i} value={view.id}>{view.name}</option>
                ))}
              </select>}
            </FormControl>
          </div>
        </div>
      );
    }
  }
}
