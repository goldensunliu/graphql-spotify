var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: "commonjs2",
        filename: 'lib.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options:{
                    "presets": [
                        ["env", {
                            "targets": {
                                "node": "current"
                            }
                        }]
                    ],
                    "plugins": [
                        ["transform-object-rest-spread", { "useBuiltIns": true }]
                    ]
                }
            }
        ]
    },
    stats: {
        colors: true
    },
    target: "node",
    externals: ["graphql-tools", "isomorphic-fetch", "dataloader"],
    devtool: 'source-map'
};