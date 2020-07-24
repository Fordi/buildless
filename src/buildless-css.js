const joinClass = (...classes) => Array.from(new Set(classes.filter(a => !!a).join(' ').split(' ').reverse())).reverse().join(' ');

export const classes = (...names) => Object.assign(
  (...more) => classes(...names, ...more),
  {
    toString: () => joinClass(...names),
    and: (...more) => classes(...names, ...more),
  }
);

const createStylesheet = (str) => {
  const rid = Math.random().toString(36).substr(2);
  const cssRules = parseRules(str);
  const styles = {};
  cssRules.forEach(rule => Object.assign(styles, insertRule(rule, rid)));
  Object.keys(styles).forEach(name => {
    styles[name] = classes(styles[name])
  });
  return styles;
};

const head = document.querySelector('head');
const { sheet } = head.appendChild(document.createElement('style'));

const clsRx = /\.([^ \.\[:>,]+)/g;
export const css = (...args) => createStylesheet(String.raw(...args));

const appendId = (str, id) => str.endsWith(`_${id}`) ? str : `${str}_${id}`;

const insertRule = (rule, id) => {
  const classNames = allRules(rule).reduce((cls, r) => {
    if (r.type === CSSRule.KEYFRAMES_RULE) {
      r.name = appendId(r.name, id);
    }
    if (r.style && r.style.animationName) {
      r.style.animationName = appendId(r.style.animationName, id);
    }
    if (r.selectorText) {
      r.selectorText = r.selectorText.replace(clsRx, (_, m) => {
        cls[m] = appendId(m, id);
        return `.${cls[m]}`;
      });
    }
    return cls;
  }, {});
  sheet.insertRule(rule.cssText);
  return classNames;
};

const allRules = a => (
  a.selectorText
    ? [a]
    : Array.from(a.cssRules || []).reduce((list, rule) => (
      [a, ...list, ...allRules(rule)]
    ), [])
);

const parseRules = css => {
  const t = document.createElement('style');
  t.textContent = css;
  head.appendChild(t);
  const r = t.sheet;
  head.removeChild(t);
  return Array.from(r.cssRules);
};
