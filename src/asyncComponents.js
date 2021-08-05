const Blank = () => null;

export default ({
  createElement,
  useState,
  useEffect,
}) => {
  const asyncComponents = (promisor, Loading = Blank) => {
    let cachedPromise = null;
    return new Proxy({}, {
      get: (_, name) => props => {
        const [{ Comp }, setComp] = useState({ Comp: Loading });
        useEffect(() => {
          if (!cachedPromise) cachedPromise = promisor();
          cachedPromise.then(mod => {
            if (!(name in mod)) {
              console.warn(`Cannot find ${name} in ${Object.keys(mod)}!`);
              setComp({ Comp: () => null });
            } else {
              setComp({ Comp: mod[name] });
            }
          });
        }, []);
        return createElement(Comp, props);
      },
    });
  };

  const asyncComponent = (promisor, Loading, ...names) => {
    const lib = asyncComponents(promisor, Loading);
    // Legacy behavior; remove in next major.
    if (names.length) {
      return names.reduce((o, n) => ({ ...o, [n]: lib[n] }), {});
    }
    const { default: asyncComp } = lib;
    return asyncComp;
  };

  return { asyncComponent, asyncComponents };
};