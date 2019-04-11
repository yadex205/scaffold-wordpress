const { resolve } = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const DockerCopyWebpackPlugin = require('./lib/docker-copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const autoprefixer = require('autoprefixer');
const nodeSassGlobImporter = require('node-sass-glob-importer');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = [
  {
    mode: IS_PRODUCTION ? 'production' : 'development',
    entry: [
      './src/sample-theme/assets/js/app.js',
      './src/sample-theme/assets/css/app.scss'
    ],
    output: {
      path: resolve(__dirname, './dist/sample-theme'),
      filename: 'app.js'
    },
    plugins: [
      new DockerCopyWebpackPlugin({
        serviceName: 'app',
        src: './dist/sample-theme/',
        dest: '/usr/local/site/wp-content/themes'
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css'
      }),
      new CopyWebpackPlugin([
        { context: './src/sample-theme', from: './**/*.php' },
        { context: './src/sample-theme', from: './assets/!(css|js)/**/*' }
      ])
    ],
    module: {
      rules: [
        {
          test: /\.js/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: { ie: '11' } }]
              ]
            }
          }
        },
        {
          test: /\.s(a|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [autoprefixer()]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                importer: nodeSassGlobImporter()
              }
            }
          ]
        }
      ]
    }
  },
  {
    mode: IS_PRODUCTION ? 'production' : 'development',
    entry: [
      './src/sample-plugin/assets/js/app.js',
      './src/sample-plugin/assets/css/app.scss'
    ],
    output: {
      path: resolve(__dirname, './dist/sample-plugin'),
      filename: 'app.js'
    },
    plugins: [
      new DockerCopyWebpackPlugin({
        serviceName: 'app',
        src: './dist/sample-plugin/',
        dest: '/usr/local/site/wp-content/plugins'
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css'
      }),
      new CopyWebpackPlugin([
        { context: './src/sample-plugin', from: './**/*.php' },
        { context: './src/sample-plugin', from: './assets/!(css|js)/**/*' }
      ])
    ],
    module: {
      rules: [
        {
          test: /\.js/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: { ie: '11' } }]
              ]
            }
          }
        },
        {
          test: /\.s(a|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: [autoprefixer()]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                importer: nodeSassGlobImporter()
              }
            }
          ]
        }
      ]
    }
  }
];
