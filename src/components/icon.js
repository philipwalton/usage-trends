import React, {Component} from 'react';

// Styles
import styles from './icon.css';


export default class Icon extends Component {
  render() {
    return (
      <svg className={styles.root} viewBox="0 0 24 24">
        {this.props.children}
      </svg>
    );
  }
}
