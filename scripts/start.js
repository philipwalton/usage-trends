/* eslint no-console: "off" */

const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const createWebpackMiddleware = require('webpack-dev-middleware');
const {generatePage, generateMedia} = require('./build');
const webpackConfig = require('../webpack.config.js');

const PORT = 8080;
const PATH = webpackConfig.output.publicPath;

const app = express();
const compiler = webpack(webpackConfig);
const webpackDevMiddleware = createWebpackMiddleware(compiler, {
  stats: webpackConfig.stats,
  publicPath: PATH,
});

fs.removeSync('usage-trends');

app.use(PATH, express.static(path.resolve(__dirname, '../usage-trends')));
app.use(webpackDevMiddleware);
app.listen(PORT, () => {
  console.log(`App started on http://localhost:${PORT}${PATH}`);
});

fs.watch('src/templates', generatePage);
fs.watch('src/styles', generatePage);
fs.watch('src/media', generateMedia);

Promise.all([generateMedia(), generatePage()])
    .catch(console.error.bind(console));
