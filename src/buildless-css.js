const joinClass = (...classes) => Array.from(new Set(classes.filter(a => !!a).join(' ').split(' '))).join(' ');

export const classes = (...names) => ({
  toString: () => joinClass(...names),
  and: (...more) => classes(...names, ...more),
});

export const css = (...args) => {
  const rid = Math.random().toString(36).substr(2);
  const cssRules = parseRules(String.raw(...args));
  const styles = {};
  cssRules.forEach(rule => Object.assign(styles, insertRule(rule.cssText, rid)));
  Object.keys(styles).forEach(name => {
    styles[name] = classes(styles[name])
  });
  return styles;
};

const head = document.querySelector('head');
const { sheet } = head.appendChild(document.createElement('style'));

const clsRx = /\.([^ \.\[:>,]+)/g;

const insertRule = (rule, id) => {
  return allRules(sheet.cssRules[sheet.insertRule(rule)]).reduce((cls, r) => {
    r.selectorText = r.selectorText.replace(clsRx, (_, m) => `.${cls[m] = `${m}_${id}`}`);
    return cls;
  }, {});
};

const allRules = a => (
  a.selectorText
    ? [a]
    : Array.from(a.cssRules || []).reduce((list, rule) => (
      [...list, ...allRules(rule)]
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
