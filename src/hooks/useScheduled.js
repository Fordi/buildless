/**
 * @typedef SchedulableFunction
 * @param {...any} args - any arguments
 * @returns {any} any return value
 * @throws {any} any thrown value
 */

/**
 * A function that controls the behavior of a ScheduledFunction
 * @typedef {Function} ScheduledFunctionControl
 * @returns ScheduledFunction
 */

/**
 * A function that will run once, a set amount of time after the last invokation in a series of
 *  quick invokations, with the most recent set of arguments, returning a promise.
 *
 * @typedef {Function(...any)} ScheduledFunction
 * @param {...any} args - any arguments
 * @property {ScheduledFunctionControl} disable - cancel recent calls and disable the function
 * @property {ScheduledFunctionControl} enable - reenable the function
 * @returns {Promise<any>} A promise resolving to the return value of the wrapped function, or
 *  rejecting to an error if one was thrown by the wrapped function.
 */

/**
 * Wraps a function as a {ScheduledFunction}
 * It's useful for things like on-change updating of remote resources,
 *   where the changes come quickly, but you don't want to flood your
 *   server with requests.
 * Because any call to a function generated by this hook _must_ occur
 *  asynchronously, the return value is async, and cannot be used directly
 *  as an event's return value.
 * The function returned by this hook shhould be fully memoized; i.e.,
 *  it should not change over the life of the component.
 *
 * @param {SchedulableFunction} handler function to make scheduled
 * @param {Object} [options={}] Options for the ScheduledFunction
 * @param {Number} [options.timeout=500] Minimum delay before running
 * @param {Boolean} [options.callOnUnmount=true] If the component is unmounted, any incomplete
 *  calls are completed if true, cancelled if false.
 * @returns {ScheduledFunction} The scheduled callback function
 */

export default ({ useEffect, useCallback, useRef }) => (handler, { timeout = 500, callOnUnmount = true } = {}) => {
  // Used to reset the state
  const clear = useCallback(() => {
    if (state.current.handle !== null) {
      // Cancel the last-scheduled call
      clearTimeout(state.current.handle);
    }
    state.current = {
      ...state.current,
      handle: undefined,
      params: undefined,
      deferred: undefined,
    };
  }, []);

  // Schedule the call for later.
  const schedule = useCallback(async () => {
    // If no promise is being awaitedd, just schedule the call
    if (!state.current.promise) {
      state.current = {
        ...state.current,
        handle: setTimeout(state.current.commit, state.current.timeout),
      };
    } else {
      // Otherwise, promise to do so.
      state.current.promise.then(state.current.schedule);
    }
  }, []);

  // Called to commit to calling the function with
  const commit = useCallback(async () => {
    // Already called and cleared.
    if (state.current.handle === null) return;
    const { promise, resolve, reject } = state.current.deferred;
    // Store the last promise to let `schedule` know we're waiting on something.
    state.current = {
      ...state.current,
      promise,
    };
    // Clear out the arguments
    state.current.clear();
    try {
      // Call the handler with the most recent set of params, and resolve/reject its results.
      resolve(await state.current.handler(...state.current.params));
    } catch (error) {
      reject(error);
    }
    // Remove the promise to unlock `schedule` again.
    state.current = {
      ...state.current,
      promise: undefined,
    };
  }, []);

  // The actual callback.
  // The expected behavior is that it cancels any in-flight calls,
  //  and updates the params to the new value, before scheduling
  //  `fn` (via `commit`) to be called in `timeout` milliseconds.
  //  This function is updated any time the params change.
  const callback = useCallback((...params) => {
    if (state.current.disabled) return Promise.reject();
    // Cancel the last call, if present.
    state.current.clear();
    // Set the last-known params.
    const newState = {
      ...state.current,
      params,
    };
    // create a deferred if necessary
    if (!state.current.deferred) {
      newState.deferred = {};
      newState.deferred.promise = new Promise((resolve, reject) => {
        Object.assign(newState.deferred, { resolve, reject });
      });
    }
    state.current = newState;
    // Schedule the call.
    state.current.schedule();
    // Return a promise resolving when the handler is eventually called.
    return state.current.deferred.promise;
  }, []);

  // Clear the last scheduled commit, and disable the function.
  const disable = useCallback(() => {
    state.current = {
      ...state.current,
      disabled: true,
      promise: undefined,
    };
    if (state.current.deferred) {
      state.current.deferred.reject({ cancelled: true });
    }
    state.current.clear();
    return state.current.callback;
  }, []);

  // Re-enable the function.
  const enable = useCallback(() => {
    state.current = {
      ...state.current,
      disabled: undefined,
    };
    return state.current.callback;
  }, []);

  const state = useRef({
    // -- hook args --
    //  These are updated whenever the calling component re-renders
    handler,
    timeout,
    callOnUnmount,

    // -- bookkeeping --
    // Current timeout handle.
    handle: null,
    // Last call's set of parameters.
    params: null,
    // Last batch of calls' promise/resolve/reject.
    deferred: null,
    // We clear the deferred and store its promise here while we await the handler
    // it being an actual Promise means we should schedule after its resolution.
    // (see `schedule`)
    promise: null,

    // -- Internal functions
    // These will never actually change, so we put them in the ref
    //  to avoid weird dependency loops and unnecessary
    //  change notifications.
    commit,
    clear,
    schedule,
    callback,
    disable,
  });

  // When any parameters change, update the reference.
  useEffect(() => {
    state.current = {
      ...state.current,
      handler,
      callOnUnmount,
      timeout,
    };
  }, [handler, callOnUnmount, timeout]);

  // Should the component be removed, call or clear the last-scheduled commit
  //  and disable the function.
  useEffect(() => () => {
    if (state.current.callOnUnmount) {
      state.current.commit();
    } else {
      state.current.disable();
    }
  }, []);

  return Object.assign(callback, { enable, disable });
};
