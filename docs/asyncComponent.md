# `asyncComponent`

```javascript
  // for importing the default component
  const MyComponent = asyncComponent(() => import('./path-to-component'), Loading);
  // for importing named components
  const { AnotherComponent, YetAnotherComponent } = asyncComponent(
    () => import('./path-to-component-lib'),
    Loading,
    'AnotherComponent',
    'YetAnotherComponent',
    /*...*/
  });
```

`asyncComponent(promisor, Loading)` returns a component that will render `Loading`
until the promisor resolves with an object with a `default` member, which it will
then render.  The promisor should be of the form: `() => import('./path-to-component')`,
as this enables code-splitting in webpack.

The variant, `asyncComponent(promisor, Loading, ...names)` behaves similarly, but
returns an object with keys matching `names`, which are then unpacked once
the module has loaded.

The components returned can be used like any other component.

## Example

```javascript
const Loading = () => html`<div>Loading...</div>`;

const ArticleList = asyncComponent(() => import('./components/ArticleList.js'), Loading);
const {
  ArticleDetail,
  ArticleEditor
} = asyncComponent(() => import('./components/ArticleDetail.js'), Loading,
  'ArticleDetail',
  'ArticleEditor'
);

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