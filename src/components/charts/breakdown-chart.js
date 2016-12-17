import styles from './breakdown-chart.css';
import TrendChart from './trend-chart';


export default class BreakdownChart extends TrendChart {
  static defaultProps = {className: styles.root};
  state = {}

  calculateRange() {
    const values = this.props.dataset.slice(1).map((row) => row[1]);

    let max = Math.max(...values);
    let min = Math.min(...values);
    const delta = max - min;

    min = Math.max(min - delta/6, 0);
    if (min < 0.01) min = 0;

    max = Math.min(max + delta/6, 1);
    max = Math.max(max, min + 0.03);

    return {min, max};
  }

  getOptions() {
    const options = super.getOptions();

    options.colors = [options.colors[this.props.index]];
    options.chartArea.height = 400;
    options.vAxis.viewWindow = this.calculateRange();
    options.trendlines = {0: {
      type: 'linear',
      color: '#000',
      lineWidth: 3,
      opacity: 0.1,
      pointSize: 0,
    }};

    return options;
  }
}
