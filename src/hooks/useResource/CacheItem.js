export default (options, { destroy }) => {
  const state = {
    data: null,
    error: null,
    started: false,
    ready: false,
    promise: null,
    changing: false,
    methods: {},
    options: { ...options },
  };
  const listeners = [];
  let dying = null;
  const update = async updateFn => {
    state.working = true;
    notify();
    try {
      state.data = await updateFn();
    } catch (e) {
      state.error = e;
    }
    state.working = false;
    notify();
  };
  const getState = () => ({
    ...state,
    loading: (
        !state.started
        || (state.started && !state.ready)
        || state.changing
        || (state.working && (Date.now() - state.working) > 125)
    )
  });
  const notify = () => {
    const localState = getState();
    listeners.forEach(listener => listener(localState));
  };
  const listen = (listener) => {
    if (dying) {
      clearTimeout(dying);
      dying = null;
    }
    listeners.push(listener);
  };
  const kill = () => {
    if (listeners.length === 0) {
      destroy(cacheItem);
    };
    dying = null;
  };
  const unlisten = (listener) => {
    listeners.splice(listeners.indexOf(listener), 1);
    if (listeners.length === 0 && state.options.ttl) dying = setTimeout(kill, state.options.ttl);
  };
  const setMethods = (methods) => {
    state.methods = methods;
  };
  const updateOptions = (options) => state.options = { ...state.options, options };
  const cacheItem = { getState, update, notify, listen, unlisten, setMethods, updateOptions, state };
  return cacheItem;
};