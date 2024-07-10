const { postcss } = require('tailwindcss');
const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    {loader: 'postcss-loader',
      options:{
        postcssOptions:{
          plugins:[
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        },
      }
  }],
},
{
  test: /\.svg$/,
  use: ['@svgr/webpack'],
}
);

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
