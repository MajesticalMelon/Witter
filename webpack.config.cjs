const path = require('path');

module.exports = {
  entry: {
    app: './client/app.jsx',
    login: './client/login.jsx',
    user: './client/user.jsx',
    settings: '/client/settings.jsx',
    credits: '/client/credits.jsx',
  },
  target: ['web', 'es6'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  mode: 'production',
  watchOptions: {
    aggregateTimeout: 200,
  },
  output: {
    path: path.resolve(__dirname, 'hosted'),
    filename: '[name]Bundle.js',
  },
};
