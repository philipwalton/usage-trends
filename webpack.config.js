const path = require('path');
const webpack = require('webpack');


const isProd = () => {
  return process.env.NODE_ENV == 'production';
}


// Set entry based on environment.
const entry = {
  main: './src/index',
  polyfills: './src/polyfills',
};


// Set plugins based on environment.
const plugins = [new webpack.optimize.OccurrenceOrderPlugin()];
if (isProd()) {
  plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production'),
        },
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        output: {comments: false},
      }));
} else {
  plugins.push(new webpack.NoEmitOnErrorsPlugin());
}


// Set source maps based on environment.
// const devtool = ENV == 'production' ? false : 'source-map';
const devtool = 'source-map';


const config = {
  entry,
  plugins,
  devtool,
  output: {
    path: path.resolve(__dirname, 'usage-trends'),
    filename: '[name].js',
    publicPath: '/usage-trends/',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          babelrc: false,
          presets: [
            ['es2015', {'modules': false}],
            'stage-2',
            'react',
          ],
        },
      },
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader turns CSS into JS modules that inject <style> tags.
      // In production, we use a plugin to extract that CSS to a file, but
      // in development "style" loader enables hot editing of CSS.
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=' +
              `${isProd() ? '' : '[name]__[local]___'}[hash:base64:5]` +
              '!postcss-loader',
          'postcss-loader',
        ],
      },
    ],
  },
  stats: 'minimal',
};


module.exports = config;
