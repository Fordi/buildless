const { keys } = Object;

const createCacheItem = () => {
  const state = {
    data: null,
    error: null,
    started: true,
    ended: false,
    promise: null,
    changing: false,
  };
  const listeners = [];
  const update = updateFn => {
    state.data = updateFn(state.data);
  };
  const getState = () => ({
    ...state,
    loading: (state.started && !state.ended) || state.changing
  });
  const notify = () => {
    const st = getState();
    listeners.forEach(listener => listener(st));
  };
  const listen = (listener) => listeners.push(listener) && undefined;
  const unlisten = (listener) => listeners.splice(listeners.indexOf(listener), 1) && undefined;
  return { getState, update, notify, listen, unlisten, state };
};

const createCache = () => {
  const items = {};
  const get = (key) => items[key];
  const update = (key, updateFn) => items[key].update(updateFn);
  const notify = (key) => items[key].notify();
  const listen = (key, fn) => items[key].listen(fn);
  const create = (key) => (items[key] = createCacheItem()) && undefined;
  const forKey = key => ({
    update: (k, fn) => {
      update(k, fn);
      notify(k);
    },
    state: items[key].getState(),
  });
  return { get, update, notify, listen, create, forKey };
};

const cache = createCache();

export default ({ useState, useEffect }) => ({ key, ttl, ...queries }) => {
  const { get } = queries;
  if (!get) throw new Error('Must specify a `get` promisor');
  if (!cache.get(key)) cache.create(key);
  const item = cache.get(key);
  const [state, setState] = useState(item.getState());
  const methods = keys(queries).reduce((obj, mk) => ({
    ...obj,
    [mk]: (...args) => {
      item.state.changing = true;
      item.notify();
      queries[mk](cache.forKey(key), ...args)
        .then(res => {
          item.state.data = res;
          item.state.changing = false;
          item.notify();
        })
        .catch(err => {
          item.state.error = err;
          item.state.changing = false;
          item.notify();
        });
    }
  }), {});

  useEffect(() => {
    item.listen(setState);
    if (!item.started) {
      item.state.started = true;
      item.promise = get().then(res => {
        item.state.data = res;
        item.state.ended = true;
        item.notify();
      });
      item.notify();
    }
    return () => item.unlisten(setState);
  }, [item, setState]);
  return { ...item.getState(), methods };
};
