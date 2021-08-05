import mkUseEventListener from './useEventListener.js';

const { stringify, parse } = JSON;

 export default ({ useEffect, useState, useCallback }) => {
  const useEventListener = mkUseEventListener({ useEffect, useCallback });
  /**
   * Use a state that is shared between instances of this app
   * @param {*} stateKey Key to be used in localStorage
   * @param {*} defaultValue Default value if localStorage
   * @return {Tuple<*, Function>} The current state and its update function.
   */
  return (stateKey, defaultValue) => {
    // To initialize, set the state to the value in localStorage, or to the default.
    const [state, setState] = useState(() => {
      const stored = localStorage.getItem(stateKey);
      if (stored) {
        try {
          return parse(stored);
        } catch (e) {
          // fall through
        }
      }
      localStorage.setItem(stateKey, stringify(defaultValue));
      return defaultValue;
    });

    // Also for initialization, populate the JSON of the initial state to a local cache
    const [json, setJson] = useState(() => stringify(state));

    // During operation, any time the storage value changes, update the state if it != `json`.
    useEventListener(window, 'storage', ({ key, newValue }) => {
      if (stateKey !== key) return;
      if (newValue === json) return;
      try {
        setState(parse(newValue));
      } catch (e) {
        setState(defaultValue);
      }
    }, [stateKey, json, defaultValue]);

    // During operation, stringify new values for state to our JSON cache
    useEffect(() => setJson(stringify(state)), [state]);

    // During operation, any time `json` changes, update storage if the value has changed.
    useEffect(() => {
      if (json === localStorage.getItem(stateKey)) return;
      localStorage.setItem(stateKey, json);
    }, [json, stateKey]);

    return [state, setState];
  };
 };