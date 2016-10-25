var webpack = require('webpack');

console.log( __dirname );

module.exports = {
    entry: {
       index: __dirname + "/src/index.js"
    },
    output: {
        path: __dirname + "/dist/",
        filename: '[name].js'
    }
}
