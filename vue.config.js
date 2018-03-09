var webpack = require('webpack');

module.exports = {
    configureWebpack: config => (
        (process.env.NODE_ENV !== 'production') ? {} : {
            output: {
                publicPath: '/mirrordash/'
            }
        }
    )
}