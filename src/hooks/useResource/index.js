import Cache from './Cache.js';
const cache = Cache();

const hookResource = ({ useState, useEffect }) => ({ key, ttl, ...queries }) => {
  const { get } = queries;
  if (!get) throw new Error('Must specify a `get` promisor');
  const item = cache.get(key, { ttl }) || cache.create(key, { ttl });
  const [, setState] = useState(item.getState());
  item.setMethods(Object.keys(queries).reduce((obj, mk) => ({
    ...obj,
    [mk]: (...args) => {
      item.state.changing = true;
      item.notify();
      queries[mk](cache.forKey(key))(...args).then(res => {
        if (res !== undefined) item.state.data = res;
        item.state.changing = false;
        item.notify();
      }).catch(err => {
        item.state.error = err || new Error('Unknown rejection');
        item.state.changing = false;
        item.notify();
      });
    }
  }), {}));

  useEffect(() => {
    item.listen(setState);
    if (!item.state.started) {
      item.state.started = true;
      item.notify();
      get(cache.forKey(key))().then(res => {
        item.state.data = res;
        item.state.ready = true;
        item.notify();
      }).catch(err => {
        item.state.error = err;
        item.state.ready = true;
        item.notify();
      });
    }
    return () => item.unlisten(setState);
  }, [item, setState]);
  return item.getState();
};

export default hookResource;