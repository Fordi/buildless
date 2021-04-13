# `asyncComponent` / `asyncComponents`

```javascript
  // for importing the default component
  const MyComponent = asyncComponent(() => import('./path-to-component'), Loading);
  // for importing named components
  const { AnotherComponent, YetAnotherComponent } = asyncComponents(
    () => import('./path-to-component-lib'),
    Loading
  });
```

`asyncComponent(promisor, Loading)` returns a component that will render `Loading`
until the promisor resolves with an object with a `default` member, which it will
then render.  The promisor should be of the form: `() => import('./path-to-component')`,
as this enables code-splitting in webpack.

The variant, `asyncComponents(promisor, Loading)` behaves similarly, but
returns a `Proxy` object that will defer the key lookup, unpacking the module once
it has loaded.

The components returned can be used like any other component.

## Example

```javascript
const Loading = () => html`<div>Loading...</div>`;

const ArticleList = asyncComponent(() => import('./components/ArticleList.js'), Loading);
const {
  ArticleDetail,
  ArticleEditor
} = asyncComponents(() => import('./components/ArticleDetail.js'), Loading);

render(html`
  <${Router}>
    <${ArticleList} path="/" />
    <${ArticleDetail} path="/article/:postId" />
    <${ArticleEditor} path="/article/:postId/edit" />
  <//>
`, document.body);
```

Used in this way, each page and its set of dependent components will load _only_ upon routing
to that page.  You're likely only going to use this when routing, as it kinda sucks for the user
to have a loading box popcorning all over the page as individual components load up.

If you must mix named and default imports (please don't), you can access the default export as 
`default`, renaming it as you see fit in the destructor, e.g.,

```javascript
const {
  default: Foo,
  Bar,
  Baz
} = asyncComponents(() => import('./fooBarBaz.js'), Loading);
```

If `Loading` is omitted, the null component (`() => null`) is used instead.

The functionality, `asyncComponent(() => import(...), Loading, ...names)` is deprecated, 
but should still work for until 2.0; use `asyncComponents` instead.