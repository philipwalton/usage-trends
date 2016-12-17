import styles from './aggregate-chart.css';
import TrendChart from './trend-chart';


export default class AggregateChart extends TrendChart {
  static defaultProps = {
    className: styles.root,
    title: 'All Results',
  }

  state = {}

  getValueRange() {
    return [0, 100];
  }
}
