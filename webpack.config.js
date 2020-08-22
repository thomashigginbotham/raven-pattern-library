const path = require('path');

module.exports = {
  mode: 'development',
  entry: './.tmp/ts/dist/main.js',
  output: {
    library: 'Main',
    libraryExport: 'default',
    path: path.resolve(__dirname, '.tmp/scripts'),
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      }
    ]
  }
};
