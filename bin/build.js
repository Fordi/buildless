#!/usr/bin/env node

const { dirname, resolve } = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const { root, package: { buildless = {} } } = require('../lib/getProject')();

const {
  entry = './src/index.js',
  dist = 'dist',
} = buildless;

webpack({
  mode: 'production',
  entry: resolve(root, entry),
  output: {
    path: resolve(root, dist),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
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
              ['babel-plugin-minify-constant-folding'],
              ['babel-plugin-minify-dead-code-elimination'],
              ['babel-plugin-minify-flip-comparisons'],
              ['babel-plugin-minify-guarded-expressions'],
              ['babel-plugin-minify-infinity'],
              ['babel-plugin-minify-mangle-names'],
              ['babel-plugin-minify-replace'],
              ['babel-plugin-minify-simplify'],
              ['babel-plugin-minify-type-constructors'],
              ['babel-plugin-transform-member-expression-literals'],
              ['babel-plugin-transform-merge-sibling-variables'],
              ['babel-plugin-transform-minify-booleans'],
              ['babel-plugin-transform-property-literals'],
              ['babel-plugin-transform-simplify-comparison-operators'],
              ['babel-plugin-transform-undefined-to-void']
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
