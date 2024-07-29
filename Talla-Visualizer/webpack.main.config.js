const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // Add this line
module.exports = {
  entry: './src/main.js',
  // output: {
  //   path: path.resolve(__dirname, '.webpack/main'),
  //   filename: 'main.js',
  // },
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false,
  },
  module: {
    rules: require('./webpack.rules'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/preload.js', to: 'preload.js' },
      ],
    }),
  ],
};
