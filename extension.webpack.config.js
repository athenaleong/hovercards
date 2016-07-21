var webpack            = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin  = require('copy-webpack-plugin');
var ExtractTextPlugin  = require('extract-text-webpack-plugin');
var WriteFilePlugin    = require('write-file-webpack-plugin');

module.exports = {
	entry: {
		'background':  ['./app/background.js'],
		'every-frame': ['./app/every-frame.js'],
		'options':     ['./app/options.js'],
		'top-frame':   ['./app/top-frame.js']
	},
	output: {
		path:     'dist',
		filename: '[name].js'
	},
	module: {
		loaders: [
			{ test: /\.html/, loaders: ['ractive'], exclude: 'node_modules' },
			{ test: /\.ract/, loaders: ['ractive-component'], exclude: 'node_modules' },
			{ test: /\.json/, loaders: ['json'], exclude: 'node_modules' },
			{ test: /\.css$/, loader: ExtractTextPlugin.extract('css?sourceMap&modules&localIdentName=HOVERCARDS-[local]'), exclude: 'node_modules' },
			{ test: /.*\.(gif|png|jpe?g|svg)$/i, loaders: ['url?name=assets/images/[name].[ext]', 'image-webpack'], exclude: 'node_modules' },
			{ test: /\.ttf$|\.eot$/, loaders: ['file?name=assets/fonts/[name].[ext]'], exclude: 'node_modules' },
			{ test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loaders: ['url?name=assets/fonts/[name].[ext]'], exclude: 'node_modules' }
		],
		noParse: /node_modules\/json-schema\/lib\/validate\.js/
	},
	node: {
		console: true,
		fs:      'empty',
		net:     'empty',
		tls:     'empty'
	},
	plugins: [
		new webpack.EnvironmentPlugin([
			'INSTAGRAM_CLIENT_ID',
			'NODE_ENV',
			'STICKYCARDS'
		]),
		new CleanWebpackPlugin(['dist']),
		new CopyWebpackPlugin([
			{ from: 'app/_locales', to: '_locales' },
			{ from: 'app/manifest.json' },
			{ from: 'app/options.html' },
			{ from: 'assets/images/*-icon-full_color.png', to: 'assets/images', flatten: true },
			{ from: 'assets/images/logo-*', to: 'assets/images', flatten: true }
		]),
		new ExtractTextPlugin('[name].css'),
		new WriteFilePlugin({ log: false })
	],
	devServer: {
		outputPath: 'dist',
		port:       3030
	},
	devtool: 'source-map'
};
