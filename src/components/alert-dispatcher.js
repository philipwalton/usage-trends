import React, {Component} from 'react';
import CssTransitionGroup from 'react-addons-css-transition-group';
import Alert from './alert';

// Styles
import alertDispatcherStyles from './alert-dispatcher.css';
import alertStyles from './alert.css';

export default class AlertDispatcher extends Component {
  render() {
    return (
      <CssTransitionGroup
        component="div"
        className={alertDispatcherStyles.root}
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}
        transitionName={{
          enter: alertStyles._enter,
          enterActive: alertStyles._enterActive,
          leave: alertStyles._leave,
          leaveActive: alertStyles._leaveActive,
        }}>
        {this.props.alerts.map((alert, i) => (
          <Alert
            key={i}
            id={i}
            title={alert.title}
            message={alert.message}
            onRemove={this.props.onRemove.bind(null, alert)} />
        ))}
      </CssTransitionGroup>
    );
  }
}
