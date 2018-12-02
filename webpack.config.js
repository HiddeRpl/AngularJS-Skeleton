const isProd = process.env.NODE_ENV === 'production'

const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageMinPlugin = require('imagemin-webpack-plugin').default
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const distDir = '/build/latest'

const rules = {
  tslint: {
    enforce: 'pre',
    test: /\.tsx?$/,
    exclude: /node_modules/,
    loader: 'tslint-loader',
    options: {
      emitErrors: true,
    },
  },
  fonts: {
    test: /\.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
    loader: 'file-loader?name=font/icons/[name].[ext]',
  },
  css: {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!postcss-loader'}),
  },
  scss: {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!postcss-loader!sass-loader'}),
  },
  images: {
    test: /\.(jpg|svg|png|gif(2)?)(\?[a-z0-9]+)?$/,
    loader: 'file-loader',
  },
  js: {
    test: /\.js$/,
    exclude: /node_modules/,
    loaders: ['babel-loader'],
  },
  ts: {
    test: /\.tsx?$/,
    loaders: ['babel-loader', 'awesome-typescript-loader', 'required-loader'],
  },
  html: {
    test: /\.html$/,
    loader: 'ng-cache-loader?prefix=src:**',
    exclude: path.resolve(__dirname, 'src/index.html'),
  },
}

const filesToCopy = [{
  from: '{common,components,modules,shivs}/**/*.html',
  context: 'src/',
}, {
  from: '**/image/**/*.{png,jpg,jpeg,svg,gif,ico}',
  context: 'src/components/',
  to: 'image/components',
}, {
  from: 'src/modules/**/image/**/*.{png,jpg,jpeg,svg,gif,ico}',
  to: 'image/modules',
  flatten: true,
}, {
  from: 'src/shivs/**/image/**/*.{png,jpg,jpeg,svg,gif,ico}',
  to: 'image/shivs',
  flatten: true,
}, {
  from: 'src/common/assets/image/*.{png,jpg,jpeg,svg,gif,ico}',
  to: 'image',
  flatten: true,
}, {
  from: 'src/common/assets/image/favicon/*.{png,jpg,jpeg,svg,gif,ico}',
  to: 'image',
  flatten: true,
}, {
  from: '*.txt',
  context: 'src',
}]


const plugins = [
  new ExtractTextPlugin({filename: '[name].css', allChunks: true}),
  new CopyWebpackPlugin(filesToCopy),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    minify: isProd ? {
      collapseWhitespace: true,
      conservativeCollapse: false,
    } : {},
  }),
  new ImageMinPlugin({
    disable: !isProd,
    pngquant: {
      quality: '50',
    },
    externalImages: {
      sources: glob.sync(`${distDir}/image/*.{png,jpg,jpeg,svg,gif,ico}`),
    },
  }),
]

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 5050,
    allowedHosts: ['gui-customer.service.consul', 'gui-customer.dev.c1.org.pl'],
    proxy: {'*': {target: 'http://localhost:4000', secure: false}},
  },
  devtool: isProd ? 'source-map' : 'eval',
  entry: {
    app: [
      'babel-polyfill',
      './src/common/app.ts',
    ],
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, distDir),
  },
  module: {
    rules: [
      rules.tslint,
      rules.js,
      rules.ts,
      rules.fonts,
      rules.css,
      rules.scss,
      rules.images,
      rules.html,
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx', '.html'],
    alias: {
      image: path.resolve(__dirname, 'src', 'common', 'assets', 'image'),
      modules: path.resolve(__dirname, 'src', 'modules'),
      jquery: path.join(__dirname, 'node_modules/jquery/dist/jquery'),
    },
  },
  plugins: plugins,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          minSize: 1,
        },
      },
    },
  },
  stats: 'minimal',
}
