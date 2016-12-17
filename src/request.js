/* global gapi */

export const makeRequest = (reportRequest) => {
  return new Promise((resolve, reject) => {
    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [reportRequest],
      },
    }).then(
        ({result}) => resolve(result.reports[0]),
        ({result}) => reject(result.error));
  });
};

export const makeFullRequest = (reportRequest, lastReport) => {
  return makeRequest(reportRequest).then((report) => {
    if (lastReport) {
      report.data.rows = report.data.rows.concat(lastReport.data.rows);
    }
    if (report.nextPageToken) {
      reportRequest.pageToken = report.nextPageToken;
      return makeFullRequest(reportRequest, report);
    } else {
      return report;
    }
  });
};
