const moduleCache = {};
export default ({
  createElement,
  useState,
  useEffect,
}) => ({
  componentPath,
  names,
  Loading: Loader = () => null,
}) => {
  const path = new URL(componentPath, Object.assign(document.createElement('a'), { href: '.' }).href).toString();
  const buildComponent = name => {
    const getComponent = () => {
      const mod = moduleCache[path];
      if (!mod || mod.then) return null;
      return mod[name];
    };
    return props => {
      const [Comp, setComp] = useState(getComponent);
      useEffect(() => {
        if (Comp) return;
        if (!moduleCache[path] || !moduleCache.then) {
          moduleCache[path] = import(path);
        }
        moduleCache[path].then(mod => {
          moduleCache[path] = mod;
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
