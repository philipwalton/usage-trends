import React, {Component} from 'react';

// Styles
import formControlStyles from './form-control.css';
import formFieldStyles from '../styles/form-field.css';


export default class FormControl extends Component {
  render() {
    const classes = [formControlStyles.root];
    if (this.props.full) classes.push(formControlStyles._full);
    if (this.props.action) classes.push(formControlStyles._action);

    return (
      <div className={classes.join(' ')}>
        {!this.props.label ? null : (
          <label className={formControlStyles.label}>
            {this.props.label}
          </label>
        )}
        <div className={formControlStyles.body}>
          {this.props.children || (
            <select className={formFieldStyles.root} disabled />
          )}
        </div>
      </div>
    );
  }
}
