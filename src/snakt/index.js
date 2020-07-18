import createElement from './createElement.js';
import Renderer from './Renderer.js';

export const { render, createHook } = Renderer();
export const h = createElement;

export const useState = createHook((oldHook, setHook, needsRerender) => (initial) => {
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };
  const actions = oldHook ? oldHook.queue : [];
  for (let i = 0; i < actions.length; i++) hook.state = actions[i](hook.state);
  const setState = action => {
    hook.queue.push(action instanceof Function ? action : () => action);
    needsRerender();
  };
  setHook(hook);
  return [hook.state, setState];
});

export const useEffect = createHook((oldHook = {}, setHook, needsRerender) => (handler, values) => {
  let lastResult = oldHook.lastResult;
  if (values !== undefined || !!values.find((value, i) => values[i] !== oldHook.values[i])) {
    if (lastResult instanceof Function) lastResult();
    lastResult = handler();
    needsRerender();
  }
  setHook({ values, lastResult });
});
