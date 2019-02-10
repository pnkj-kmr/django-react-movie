const path = require('path');
module.exports = {
    mode: "development",
    entry: "./gui/js/Index.js",
    output: {
        path: __dirname + '/src/staticfiles/js',
        // publicPath: 'http://127.0.0.1:8080/staticfiles/'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            }
        ]
    },
    devServer: {
        hot: true,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        // contentBase: path.resolve(__dirname, 'staticfiles/js')
    }
}