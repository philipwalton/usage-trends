/* eslint no-console: "off" */

const fs = require('fs-extra');
const path = require('path');
const sh = require('shelljs');
const {generatePage, generateMedia, generateScript} = require('./build');
const webpackConfig = require('../webpack.config.js');


const PATH = webpackConfig.output.publicPath.replace(/\//g, '');


if (process.env.NODE_ENV != 'production') {
  console.error('The deploy script must be run in production mode');
  process.exit(1);
}

fs.removeSync(PATH);


const publishToGhPages = () => {
  // Create a tempory directory and
  // checkout the existing gh-pages branch.
  sh.rm('-rf', '_tmp');
  sh.mkdir('_tmp');
  sh.cd('_tmp');
  sh.exec('git init');
  sh.exec('git remote add origin git@github.com:philipwalton/' + PATH + '.git');
  sh.exec('git pull origin gh-pages');

  // Delete all the existing files and add
  // the new ones from the build directory.
  sh.rm('-rf', './*');
  sh.cp('-rf', path.join('..', PATH, '/*'), './');
  sh.exec('git add -A');

  // Commit and push the changes to
  // the gh-pages branch.
  sh.exec('git commit -m "Deploy site"');
  sh.exec('git branch -m gh-pages');
  sh.exec('git push origin gh-pages');

  // Clean up.
  sh.cd('..');
  sh.rm('-rf', '_tmp');
  sh.rm('-rf', PATH);
};


Promise.all([generateMedia(), generatePage(), generateScript()])
    .then(() => publishToGhPages())
    .catch((err) => console.error(err));
