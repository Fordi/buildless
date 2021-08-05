# `useSharedState`

```javascript
const [text, setText] = useSharedState('text', '');
```

Meant for use in place of `useState`, for when you need to coordinate state between different windows/tabs of the same app.

## Example usage:

If the following micro-app is opened in more than one window, the content of the input field will always be the same regardless of use input.

```javascript
export default () => {
  const [text, setText] = useSharedState('app-text', '');
  const onChange = ({ target: { value } }) => setText(value);
  return html`<input value=${text} onChange=${onChange} />`;
};
```
