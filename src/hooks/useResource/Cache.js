import CacheItem from './CacheItem.js';

export default () => {
  const items = {};
  const get = (key, options) => {
    const item = items[key];
    if (item && options) {
      item.updateOptions(options);
    }
    return item;
  };
  const create = (key, options) => items[key] = CacheItem(options, { destroy });
  const destroy = (cacheItem) => {
    const k = Object.keys(items).find(key => items[key] === cacheItem);
    if (k) {
      delete items[k];
      cacheItem.notify();
    }
  };
  const forKey = key => {
    const item = items[key];
    if (!item) return null;
    return {
      update: async (fn) => {
        items[key] && items[key].update(async () => fn(items[key].getState()));
      },
      destroy: () => {
        const item = items[key];
        delete items[key];
        item && item.notify();
      },
      stale: () => {
        if (items[key]) {
          Object.assign(items[key].state, {
              error: null,
              started: false,
              ready: false,
              promise: null,
              changing: false
          });
          items[key].notify();
        }
      },
      state: item && item.getState(),
      for: key => forKey(key)
    };
  };
  const setMethods = (key, methods) => items[key].setMethods(methods);
  const cache = { get, create, forKey, setMethods };
  return cache;
};