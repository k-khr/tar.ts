module.exports = {
  mode: 'production',
  devtool: false,
  entry: './example/index.ts',
  output: {
    path: __dirname + '/example',
    filename: 'index.js',
  },
  module: {
    rules: [
      { test: /\.ts$/, use: 'ts-loader' },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
}