var path = require('path');
module.exports = {
    entry: path.resolve(__dirname, "src/js/index.js"),
    output: {
      path: path.resolve(__dirname, 'dist/js'),
      filename: 'bundle.js'
    },
    resolve: {
      extensions: ['', '.js'],
      alias: {
        jquery: 'src/lib/jquery.min.js'
      }
    },
    node: {
      fs: "empty"
    }
};
