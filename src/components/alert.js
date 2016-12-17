import React, {Component} from 'react';
import Icon from './icon';

// Styles
import styles from './alert.css';


const warningIconPath =
    'M12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-' +
    '5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 ' +
    '7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 ' +
    '2.93-7.055 7.055-2.93zM11.016 6.984h1.969v6h-1.969v-6zM11.016 15h1.969' +
    'v2.016h-1.969v-2.016z';


const closeIconPath =
    'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 ' +
    '13.41 17.59 19 19 17.59 13.41 12z';


export default class Alert extends Component {
  render() {
    return (
      <div
        className={styles.root}
        style={{zIndex: -this.props.id}}>
        <div className={styles.icon}>
          <Icon>
            <path d={warningIconPath}></path>
          </Icon>
        </div>
        <div className={styles.body}>
          <h1 className={styles.title}>{this.props.title}</h1>
          <div className={styles.message}>{this.props.message}</div>
        </div>
        <button
          className={styles.close}
          onClick={this.props.onRemove}>
          <Icon>
            <path d={closeIconPath} />
          </Icon>
        </button>
      </div>
    );
  }
}
