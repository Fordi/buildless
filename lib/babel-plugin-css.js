const CleanCSS = require('clean-css');
const minifier = new CleanCSS({ advanced: false, keepSpecialComments: '*' });
module.exports = ({ types }, { tag = 'css' } = {}) => {
  return {
    name: 'css',
    visitor: {
      TaggedTemplateExpression(path, state) {
        const tagName = path.node.tag.name;
        if (tagName === tag) {
          const raw = path.node.quasi.quasis.map(e => e.value.raw);
          raw.raw = raw;
          const subs = [];
          for (let i = 0; i < path.node.quasi.expressions.length; i++) {
            subs.push('1/*!sub*/');
          }
          const pseudoCss = String.raw(raw, ...subs);
          const minified = minifier.minify(pseudoCss).styles.split(/1\/\*!sub\*\//);
          path.node.quasi.quasis.forEach((q, i) => {
            q.value.raw = q.value.cooked = minified[i];
          });
        }
      }
    }
  };
};
