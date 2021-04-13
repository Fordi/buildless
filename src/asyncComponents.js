const Blank = () => null;

export default ({
  createElement,
  useState,
  useEffect,
}) => {
  const asyncComponents = (promisor, Loading = Blank) => {
    let cachedPromise = null;
    const cachedPromisor = () => {
      if (!cachedPromise) {
        cachedPromise = promisor();
      }
      return cachedPromise;
    };
  
    const buildComponent = name => {
      return props => {
        const [{ Comp }, setComp] = useState({ Comp: Loading });
        useEffect(() => {
          cachedPromisor().then(mod => {
            if (!(name in mod)) {
              console.warn(`Cannot find ${name} in ${Object.keys(mod)}!`);
            } else {
              setComp({ Comp: mod[name] });
            }
          });
        }, []);
        return createElement(Comp, props);
      };
    };
    return new Proxy({}, {
      get: (_, name) => buildComponent(name),
    });
  };

  const asyncComponent = (promisor, Loading, ...names) => {
    const lib = asyncComponents(promisor, Loading);
    // Legacy behavior; remove in next major.
    if (names.length) {
      return names.reduce((o, n) => ({ ...o, [n]: lib[n] }), {});
    }
    const { default: asyncComp } = asyncComponents(promisor, Loading);
    return asyncComp;
  };

  return { asyncComponent, asyncComponents };
};