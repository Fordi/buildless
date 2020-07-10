module.exports = ({ types }, { pathMap = {} } = {}) => {
  const unUnPkg = ({ node: { source } }) => {
    if (!source || !source.value) return;
    const { value } = source;
    if (value.startsWith('https://unpkg.com/')) {
      const path = value.split('/').slice(3);
      const pkg = (path[0] === '@' ? path.shift() : `${path.shift()}/${path.shift()}`).replace(/@[\d\.]+$/, '');
      const into = path.join('/');
      source.value = `${pkg}/${(pathMap[pkg] && pathMap[pkg][into]) || into}`;
    }
  };
  return {
    name: 'ununpkg',
    visitor: {
      ExportAllDeclaration: unUnPkg,
      ExportNamedDeclaration: unUnPkg,
      ImportDeclaration: unUnPkg,
    }
  };
};
