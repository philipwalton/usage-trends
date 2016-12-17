import React, {Component} from 'react';

// Styles
import styles from './section.css';


export default class Section extends Component {
  render() {
    const classes = [styles.root];
    if (this.props.alt) classes.push(styles._alt);
    if (this.props.wide) classes.push(styles._wide);
    if (this.props.full) classes.push(styles._full);
    if (this.props.shadow) classes.push(styles._shadow);
    if (this.props.nogap) classes.push(styles._nogap);

    return (
      <div className={classes.join(' ')} style={this.props.style}>
        <div className={styles.wrapper}>{this.props.children}</div>
      </div>
    );
  }
}
