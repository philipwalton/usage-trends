/* global google */

import React, {Component} from 'react';
import styles from './trend-chart.css';
import {loadScript} from '../../utils';


// The material charts color palette.
const COLORS = [
    '#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#AB47BC', '#00ACC1',
    '#FF7043', '#9E9D24', '#5C6BC0', '#F06292', '#00796B', '#C2185B'];


let gvizLoadPromise = null;
const loadGviz = () => {
  return gvizLoadPromise ||
      (gvizLoadPromise = new Promise((resolve, reject) => {
    loadScript('https://www.gstatic.com/charts/loader.js', (err) => {
      if (err) return reject(err);
      google.charts.load('current', {'packages': ['corechart']});
      google.charts.setOnLoadCallback(resolve);
    });
  }));
};


export default class TrendChart extends Component {
  static defaultProps = {className: styles.root};

  state = {}

  handleResize = () => {
    window.clearTimeout(this.resizeTimeout);
    this.resizeTimeout = window.setTimeout(this.drawChart, 100);
  }

  drawChart = () => {
    if (this.datatable && this.options) {
      this.chart.draw(this.datatable, this.options);
    }
  }

  populateChart() {
    this.datatable = google.visualization.arrayToDataTable(this.props.dataset);
    this.options = this.getOptions();
  }

  getHAxisTicksFromDataset() {
    return this.props.dataset.slice(1).map((row) => row[0]);
  }

  getOptions() {
    const options = this.getBaseOptions();

    options.title = this.props.title;
    options.hAxis.ticks = this.getHAxisTicksFromDataset();

    return options;
  }

  getBaseOptions() {
    return {
      width: '100%',
      height: '100%',
      colors: COLORS,
      interpolateNulls: true,
      fontSize: 12,
      chartArea: {
        width: '100%',
        height: 700,
        top: 100,
        left: 50,
        bottom: 75,
        right: 25,
      },
      titleTextStyle: {
        fontName: 'Arial',
        fontSize: 24,
        bold: false,
      },
      pointSize: 5,
      lineWidth: 3,
      legend: {
        position: 'top',
        alignment: 'start',
      },
      hAxis: {
        baselineColor: 'transparent',
        format: 'none',
        gridlines: {
          count: -1,
          color: 'transparent',
        },
        maxAlternation: 1,
        maxTextLines: 1,
        title: 'Weeks ago',
        titleTextStyle: {
          fontSize: 13,
          bold: true,
          italic: false,
        },
        viewWindow: {min: 0},
      },
      vAxis: {
        format: 'percent',
        gridlines: {
          color: '#eee',
          count: -1,
        },
        textPosition: 'in',
        title: '% of total',
        titleTextStyle: {
          fontSize: 13,
          bold: true,
          italic: false,
        },
        viewWindow: {
          min: 0,
          max: 1,
        },
      },
    };
  }

  componentDidMount() {
    loadGviz().then(() => {
      this.chart = new google.visualization.LineChart(this.container);
      this.setState({
        gvizLoaded: true,
        dataset: this.props.dataset,
      });
    });

    window.addEventListener('resize', this.handleResize);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dataset != nextProps.dataset) {
      this.setState({dataset: nextProps.dataset});
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !!(nextState.gvizLoaded && nextState.dataset != this.state.dataset);
  }

  componentDidUpdate() {
    this.populateChart();
    this.drawChart();
  }

  render() {
    return (
      <div
        className={this.props.className}
        ref={(el) => this.container = el} />
    );
  }

  componentWillUnMount() {
    window.removeEventListener('resize', this.handleResize);
  }
}
