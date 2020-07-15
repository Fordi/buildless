const { statSync } = require('fs');
const { resolve, dirname } = require('path');
const express = require('express');
const { root, package: { buildless = {} } } = require('../lib/getProject')();

const {
  entry = './src/index.js',
  dist = './dist',
} = buildless;

const mode = (process.argv[2] || 'src') === 'prod' ? 'prod' : 'src';
const serverPath = mode === 'src' ? dirname(resolve(root, entry)) : resolve(root, dist);
const app = express();
const http = require('http');
app.use(express.static(serverPath));
const port = parseInt(process.env.PORT) || 3000;
http.createServer({}, app).listen(port, () => {
  console.log(`Serving static files in ${mode} mode from '${serverPath}' on http://localhost:${port}/`);
});
