import webpack from 'webpack';
import WebpackNotifierPlugin from 'webpack-notifier';
import path from 'path';

// react components directory
const COMPONENTS_PATH = path.join(__dirname, 'app');
// app entry file (used for webpack only)
const APP_ENTRY_FILE = './App.jsx';
// bundle path (JavaScripts root)
const OUTPUT_PATH = path.join(__dirname, 'public');
// bundle (rails assets file)
const OUTPUT_FILE = 'bundle.js';

const env = process.env.NODE_ENV || 'development';

const autoprefixer = require('autoprefixer');

const ProvidePlugin = require('webpack/lib/ProvidePlugin');

postcss: [autoprefixer]; // this is inside module.exports object

export default {
  context: COMPONENTS_PATH,
  entry: {
    app: [APP_ENTRY_FILE, 'bootstrap', 'tether']
  },
  output: {
    path: OUTPUT_PATH,
    filename: OUTPUT_FILE
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,         // Match both .js and .jsx files
        exclude: /node_modules/,
        loader: "babel",
        query:
        {
          presets:['react']
        }
      }
    ],
    rules: [{
      test: /\.jsx?$/,         // Match both .js and .jsx files
      exclude: /node_modules/,
      use: ['babel-loader']
    },
      /*
       * Sass loader (required for Bootstrap 4)
       */
      {
        test: /\.css$/,
        use: ['raw-loader']
      },

      {
        test: /\.scss$/,
        use: ['raw-loader', 'sass-loader']
      },

      /*
       * Bootstrap 4 loader
       */
      {
        test: /bootstrap\/dist\/js\/umd\//,
        use: 'imports-loader?jQuery=jquery'
      },

      /*
       * Font loaders, required for font-awesome-sass-loader and bootstrap-loader
       */
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      },
    ]
  },
  resolve: {
    extensions: [
      '.jsx',
      '.js'
    ],
    modules: [
      COMPONENTS_PATH,
      "node_modules"
    ]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(env)
      }
    }),
    new WebpackNotifierPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jquery: "jquery",
      "window.jQuery": "jquery",
      jQuery:"jquery",
      Tether: "tether",
      "window.Tether": "tether",
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
      Button: "exports-loader?Button!bootstrap/js/dist/button",
      Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
      Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
      Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
      Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
      Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
      Util: "exports-loader?Util!bootstrap/js/dist/util"
    }),
  ]
};
