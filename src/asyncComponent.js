export default ({
  createElement,
  useState,
  useEffect,
}) => (promisor, Loading, ...names) => {
  const buildComponent = name => {
    return props => {
      const [{ Comp }, setComp] = useState({ Comp: Loading });
      useEffect(() => {
        promisor().then(mod => {
          setComp({ Comp: mod[name] });
        });
      }, []);
      return createElement(Comp, props);
    };
  };
  if (names.length) {
    return names.reduce((obj, name) => ({ ...obj, [name]: buildComponent(name) }));
  }
  return buildComponent('default');
};
