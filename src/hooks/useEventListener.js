/**
 * Attach a function as an event listener, detatching if the component is removed.
 * 
 * @param {EventListener} target Object on which to listen, e.g., a DOMElement, the window, etc.
 * @param {String} eventName name of the event to listen to
 * @param {Function} handler funtion to fire on the event
 * @param {Array{*}} deps list of variable dependencies that should update the callback function.
 *  The function does not run on changes to these deps; it is only re-created and re-attached.
 * @return void
 */
export default ({ useEffect, useCallback }) => (target, eventName, handler, deps) => {
  const listener = useCallback(handler, deps);
  useEffect(() => {
    target.addEventListener(eventName, listener);
    return () => target.removeEventListener(eventName, listener);
  }, [target, eventName, listener]);
};
