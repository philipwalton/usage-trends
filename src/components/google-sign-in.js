/* global gapi */

import React, {Component} from 'react';

// Styles
// import styles from './google-sign-in.css';


export default class GoogleSignIn extends Component {
  componentDidMount() {
    gapi.signin2.render(this.container);
  }

  render() {
    return (
      <span ref={(el) => this.container = el} />
    );
  }
}
