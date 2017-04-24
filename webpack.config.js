const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
	template: 'src/index.html',
	filename: 'index.html',
	inject: 'body'
})

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve('dist'),
		filename: 'index_bundle.js'
	},
	module: {
		loaders: [
			{test: /\.js$/, loaders: ['react-hot-loader', 'babel-loader', 'eslint-loader'], exclude: /node_modules/},
			{test: /\.jsx$/, loaders: ['react-hot-loader', 'babel-loader', 'eslint-loader'], exclude: /node_modules/},
			{test: /\.css$/, loader: 'style-loader!css-loader?modules', include: /flexboxgrid/},
			{test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file-loader?name=/fonts/[name].[ext]'}
		],
	},
	plugins: [HtmlWebpackPluginConfig],
	resolve: {
		modules: [
			path.resolve('./src'),
			path.resolve('./node_modules')
		]
	}
}