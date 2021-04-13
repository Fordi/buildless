# `makeResolver`

```javascript
const resolver = makeResolver(import.meta.url);
```

Creates a resolver relative to a given URL.  Typically, this is
`import.meta.url`, so you can resolve assets relative to the current
file instead of the browser's location.

The return value is a function that converts a relative URI to an absolute URL.

## Example usage:

```javascript
// src/PrettyPicture/index.js

const resolver = makeResolver(import.meta.url);
const prettyPicture = resolve('./pretty-picture.png');

export default () => html`
  <img src=${prettyPicture} />
`;
```
