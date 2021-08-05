# `useEventListener`

```javascript
useEventListener(window, 'blur', () => {
  console.log('My containing window has blurred');
}, []);
```

Attach a function as an event handler, detatching when the component is removed.

## Example usage:

```javascript
export default () => {
  const [focused, setFocused] = useState(true);
  useEventListener(window, 'focus', () => setFocused(true), [setFocused]);
  useEventListener(window, 'blur', () => setFocused(false), [setFocused]);
  return html`The window is ${focused ? ' ' : 'not '}focused`;
};
```
