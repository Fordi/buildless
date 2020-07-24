#!/usr/bin/env node

const { statSync } = require('fs');
const { resolve, dirname } = require('path');
const express = require('express');
const { root, package: { buildless = {} } } = require('../lib/getProject')();
const os = require('os');

const ifaces = os.networkInterfaces();
const port = parseInt(process.env.PORT) || 3000;

const urls = [`http://localhost:${port}/`];
Object.keys(ifaces).forEach(name => {
  ifaces[name].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }
    urls.push(`http://${iface.address}:${port}/`);
  });    
});

const {
  entry = './src/index.js',
  dist = './dist',
} = buildless;

const mode = (process.argv[2] || 'src') === 'prod' ? 'prod' : 'src';
const serverPath = mode === 'src' ? dirname(resolve(root, entry)) : resolve(root, dist);
const app = express();
const http = require('http');
app.use(express.static(serverPath));
app.use((req, res) => {
  res.sendFile(resolve(serverPath, 'index.html'));
});

http.createServer({}, app).listen(port, () => {
  console.log(`Serving static files in ${mode} mode from '${serverPath}' on ${urls.join(', ')}`);
});
