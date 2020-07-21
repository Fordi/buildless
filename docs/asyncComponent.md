# `asyncComponent`

```javascript
  // for importing the default component
  const MyComponent = asyncComponent({ path: './path-to-component', Loading });
  // for importing named components
  const { AnotherComponent } = asyncComponent({
    path: './path-to-component-lib',
    names: [ 'AnotherComponent' ],
  });
```

`asyncComponent({ path, Loading })` returns a component that will render `Loading`
if the component has not yet been imported, or the loaded component if it has.

The variant, `asyncComponent({ path, names, Loading })` behaves similarly, but
returns an object with matching named to `names`, which are then unpacked once
the module has loaded.

The components returned can be used like any other component.

## Example

```javascript
const Loading = () => html`<div>Loading...</div>`;

const ArticleList = asyncComponent({ path: './components/ArticleList.js', Loading });
const ArticleDetail = asyncComponent({ path: './components/ArticleDetail.js', Loading });

render(html`
  <${Router}>
    <${ArticleList} path="/" />
    <${ArticleDetail} path="/article/:postId" />
  <//>
`, document.body);
```
