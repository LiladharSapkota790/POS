const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js', // Adjust the entry point as needed

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  resolve: {
    fallback: {
      http: require.resolve('stream-http'),
      https: require.resolve('https-browserify'),
      url: require.resolve('url'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
    },
  },

  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ],

  module: {
    rules: [
      // Add loaders here if needed
    ],
  },

  devServer: {
    static: path.join(__dirname, 'public'),
    port: 3000,
  },
};
