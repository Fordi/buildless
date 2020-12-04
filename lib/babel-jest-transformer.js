const { createTransformer } = require('babel-jest');
const babelConf = require('./babel-buildless-conf.js');
module.exports = createTransformer({
  ...babelConf,
  presets: ['@babel/preset-env'],
  plugins: [
    ...babelConf.plugins,
  ],
});
