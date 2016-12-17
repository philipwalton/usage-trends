/* eslint no-console: "off" */

const fs = require('fs-extra');
const {minify} = require('html-minifier');
const nunjucks = require('nunjucks');
const postcss = require('postcss');
const SvgO = require('svgo');
const webpack = require('webpack');
const postCssConfig = require('../postcss.config.js');
const webpackConfig = require('../webpack.config.js');


const PATH = webpackConfig.output.publicPath.replace(/\//g, '');


nunjucks.configure({autoescape: false});


const processCSS = (filename) => {
  const css = fs.readFileSync(`src/styles/${filename}.css`, 'utf-8');
  return postcss(postCssConfig.plugins).process(css).then((result) => {
    result.warnings().forEach((warn) => {
      console.warn(warn.toString());
    });
    return result.css;
  });
};

const generateMedia = () => {
  const gaLogo = fs.readFileSync('src/media/ga-logo.svg', 'utf-8');
  const svgo = new SvgO();
  return new Promise((resolve, reject) => {
    svgo.optimize(gaLogo, ({data}) => {
      fs.outputFileSync(`${PATH}/ga-logo.svg`, data);
      console.log('Optimized media: ga-logo.svg');
      resolve();
    });
  });
};


const generatePage = () => {
  return Promise.all([
    processCSS('content'),
    processCSS('head'),
    processCSS('footer'),
    processCSS('loader'),
  ]).then(([content, head, footer, loader]) => {
    const template = fs.readFileSync('src/templates/index.html', 'utf-8');
    const html = nunjucks.renderString(
        template, {content, head, footer, loader});

    fs.outputFileSync(`${PATH}/index.html`, minify(html, {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      // minifyJS: true,
      // minifyCSS: true,
    }));
    console.log('Generated page: index.html');
  });
};


const generateScript = () => {
  const compiler = webpack(webpackConfig);
  return new Promise((resolve, reject) => {
    compiler.run(function(err, stats) {
      if (err) return reject(err);
      console.log(stats.toString('minimal'));
      resolve();
    });
  });
};


module.exports = {
  generateMedia,
  generatePage,
  generateScript,
};
