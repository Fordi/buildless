export default ({ useEffect }) => (fn, timeout = 250) => {
  let handle = null;
  let params = null;
  const commit = () => {
    if (handle === null) return;
    clearTimeout(handle);
    handle = null;
    fn(...params);
    params = null;
  };
  useEffect(() => commit);
  return (...args) =>{
    params = args;
    if (handle !== null) clearTimeout(handle);
    handle = setTimeout(commit, timeout);
  };
};