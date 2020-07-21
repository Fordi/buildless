# `useUid`

```javascript
const uniqueId = useUid([prefix]);
```

Returns a prefixable unique ID that remains the same through the
lifetime of the component.

## Example usage:

```javascript
const InputField = ({ label, ...props }) => {
  const { name = 'input' } = props;
  const id = useUid(name);

  return html`
    <span className="input-group">
      <label htmlFor=${id}>${label}</label>
      <input id=${id} ...${props} />
    </span>
  `;
};
```