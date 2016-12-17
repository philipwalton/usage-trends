import {makeRequest, makeFullRequest} from './request';


export const create = ({viewId, metric, dimension, maxResults, dateRange}) => {
  const dateRanges = [{startDate: `${dateRange}daysAgo`, endDate: 'yesterday'}];
  const metrics = [{expression: metric}];

  const topDimensionsResultsPromise = makeRequest({
    viewId,
    dateRanges,
    metrics,
    dimensions: [{name: dimension}],
    orderBys: [{fieldName: metric, sortOrder: 'DESCENDING'}],
    pageSize: maxResults,
  });

  const periodTotalsResultsPromise = makeFullRequest({
    viewId,
    dateRanges,
    metrics,
    dimensions: [{name: 'ga:nthWeek'}],
    orderBys: [{fieldName: metric, sortOrder: 'DESCENDING'}],
    pageSize: 10000,
  });

  return Promise.all([
    topDimensionsResultsPromise,
    periodTotalsResultsPromise,
  ]).then(([topDimensionsResults, periodTotalsResults]) => {
    const topDimensions =
        topDimensionsResults.data.rows.map((row) => row.dimensions[0]);

    const periodBreakdownResultsPromise = makeFullRequest({
      viewId,
      dateRanges,
      metrics,
      dimensions: [{name: 'ga:nthWeek'}, {name: dimension}],
      dimensionFilterClauses: [{
        operator: 'AND',
        filters: [{
          dimensionName: dimension,
          operator: 'IN_LIST',
          expressions: topDimensions,
          caseSensitive: true,
        }],
      }],
      orderBys: [{fieldName: 'ga:nthWeek', sortOrder: 'ASCENDING'}],
      pageSize: 10000,
    });

    return Promise.all([
      topDimensions,
      periodTotalsResults,
      periodBreakdownResultsPromise,
    ]);
  }).then(([topDimensions, periodTotalsResults, periodBreakdownResults]) => {
    const periodTotals = {};
    for (const row of periodTotalsResults.data.rows) {
      const periodIndex = parseInt(row.dimensions[0]);
      const value = +row.metrics[0].values[0];
      periodTotals[periodIndex] = value;
    }

    return extractReportResults(
        topDimensions, periodTotals, periodBreakdownResults);
  });
};


const extractReportResults = (topDimensions, periodTotals, report) => {
  const {rows} = report.data;

  const periodMap = new Map();
  for (const row of rows) {
    const period = parseInt(row.dimensions[0]);
    const dimension = row.dimensions[1];
    const count = +row.metrics[0].values[0];

    if (!periodMap.has(period)) {
      periodMap.set(period, {});
    }
    const periodMapEntry = periodMap.get(period);
    periodMapEntry[dimension] = count;
  }

  // Add the headers.
  const aggregateRowData = [['Weeks ago']];
  const breakdownRowData = {};
  for (const dimension of topDimensions) {
    aggregateRowData[0].push(dimension);
    breakdownRowData[dimension] = [['Weeks ago', dimension]];
  }

  // Add the rows.
  const lastPeriod = periodMap.size - 1;
  for (const [period, entry] of periodMap) {
    const periodData = {v: period, f: `${lastPeriod - period}`};
    const aggregateRow = [periodData];
    const breakdownRow = {};

    for (const dimension of topDimensions) {
      const percentage = Math.min(Math.max(
          entry[dimension] / periodTotals[period], 0), 1) || null;
      const percentageData = {
        v: percentage,
        f: `${parseFloat((percentage * 100).toFixed(2))}%`,
      };
      aggregateRow.push(percentageData);
      breakdownRow[dimension] = [periodData, percentageData];
    }

    aggregateRowData.push(aggregateRow);
    for (const dimension of topDimensions) {
      breakdownRowData[dimension].push(breakdownRow[dimension]);
    }
  }

  return {aggregateRowData, breakdownRowData};
};
