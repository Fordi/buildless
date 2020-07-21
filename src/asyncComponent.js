const moduleCache = {};
export default ({
  createElement,
  useState,
  useEffect,
}) => ({
  path,
  names,
  Loading: Loader = () => null,
}) => {
  const p = new URL(path, Object.assign(document.createElement('a'), { href: '.' }).href).toString();
  const buildComponent = name => {
    const getComponent = () => {
      const mod = moduleCache[p];
      if (!mod || mod.then) return null;
      return mod[name];
    };
    return props => {
      const [Comp, setComp] = useState(getComponent);
      useEffect(() => {
        if (Comp) return;
        if (!moduleCache[p] || !moduleCache.then) {
          moduleCache[p] = import(p);
        }
        moduleCache[p].then(mod => {
          moduleCache[p] = mod;
          setComp(getComponent);
        });
      }, []);
      if (Comp) return createElement(Comp, props);
      return createElement(Loader, props);
    };
  };
  if (names) {
    return names.reduce((obj, name) => ({ ...obj, [name]: buildComponent(name) }));
  }
  return buildComponent('default');
};
