#!/usr/bin/env node

const { dirname, resolve } = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { root, package: { buildless = {} } } = require('../lib/getProject')();
const babelConf = require('../lib/babel-buildless-conf.js');

const {
  entry = './src/index.js',
  dist = 'dist',
} = buildless;

webpack({
  mode: 'production',
  entry: resolve(root, entry),
  output: {
    path: resolve(root, dist),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            ...babelConf,
            plugins: [
              ['babel-plugin-htm', {
                pragma: 'h',
                tag: 'html',
                import: {
                  module: 'https://unpkg.com/@fordi-org/buildless',
                  export: 'h'
                },
                useNativeSpread: true
              }],
              ['@fordi-org/buildless/lib/babel-plugin-css.js'],
              ['@fordi-org/buildless/lib/babel-plugin-ununpkg.js', {
                pathMap: {
                  '@fordi-org/buildless': {
                    // Map to the prod version
                    '': 'dist/buildless.prod.modern.js'
                  }
                }
              }],
              ...babelConf.plugins
            ]
          }
        }
      }
    ]
  },
  plugins: [
    new CopyPlugin({
      patterns: [{
        from: dirname(entry),
        to: '.',
        globOptions: {
          ignore: ['**/*.js']
        }
      }]
    })
  ]
}, (err, stats) => {
  if (err) throw err;
  const { errors, warnings, fileDependencies } = stats.compilation;
  if (errors) {
    errors.forEach(error => console.warn(error))
  }
  console.log(`Processed ${fileDependencies.size} scripts in ${(stats.endTime - stats.startTime) / 1000}s`);
});
