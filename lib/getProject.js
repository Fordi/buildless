const { cwd } = require('process');
const { join, dirname } = require('path');
const { statSync, readFileSync } = require('fs');

const findProjectRoot = () => {
  let cur = cwd().replace(/\/(?:node|bower)_modules\/.*$/, '');
  while (1) {
    try {
      if (/^(?:[\w]:)?(?:[\/\\\\])$/.test(cur)) {
        break;
      }
      statSync(join(cur, 'package.json'));
      return cur;
    } catch (e) {
      cur = dirname(cur);
    }
  }
  throw new Error(`No package.json found in ${path} or any folder above it.`);
};

const getProject = () => {
  const root = findProjectRoot();
  const package = JSON.parse(readFileSync(join(root, 'package.json'), { encoding: 'utf-8' }));
  return { root, package };
};

module.exports = getProject;
