# `useResource`

```javascript
const {
  data, // the resource's data
  error, // the last error from fetching / updating the resource, usually null
  ready, // Whether the initial fetch has completed, true once your data is ready
  changing, // Whether the resource is being updated, true from a method's call to its resolution.
  loading, // Whether any operation at all is in-flight; true if changing or !ready.
  methods: { // Operations that may be called on this resource, defined below
    /* ... */
  },
} = useResource({
  key: 'myResource', // key for the resource
  ttl: 2000,  // how long to retain the resource in the cache
              // after the last listening component has unmounted
              // if not present, the resource remains in the cache
              // indefinitely.
  get: (cache) => async (...args) => { /* ... */ },
  /*
    // Further functions passed here should be of the following form,
    // and will be unwrapped and placed in `methods` above
    update: (cache) => async (newProps) => { ... },
  */
});
```

`useResource` is for managing server-side and other async resources from
within functional components.  The state of a resource is shared between
all components, and is cacheable.

Typically, you won't want to define your resources inline - as above - since
each resource could have a unique URL - for example `/articles/:articleId`.
You'd want to make a factory, e.g.,

```javascript
const articleResource = (postId) => {
  const path = `/articles/:articleId`;
  return {
    key: path,
    ttl: 2000,
    get: () => () => fetch(path).then(r => r.json()),
    update: () => (details) => fetch(path, {
      method: 'POST',
      body: JSON.stringify(details),
      header: { 'content-type': 'application/json' }
    }).then(r => r.json()),
    delete: async (cache) => {
      await fetch(path, { method: 'DELETE' });
      cache.destroy();
      return null;
    },
  }
};
```

The resolved value from resource methods' promises becomes the new state's
`data` field, and any errors thrown become the state's `error` field - so be
aware of what you're returning.

In your component, you'd use the above resource thusly:

```javascript
const ArticleDetails = ({ postId }) => {
  const { data, ready, loading, error, methods } = useResource(articleResource(postId));
  if (!ready) return html`<${Loading} ... />`;
  const save = (event) => {
    const details = { /* gather edited details here */ };
    methods.update(details);
  };
  return html`
    <div className=${styles.article.and(loading && styles.loading)}>
      <!-- format article data here, for example -->
      <input type="text" name="title" value=${data.title} />
      <button className=${styles.saveButton} onClick=${save} />
    </div>
  `;
};
```

## the `cache` object

The `cache` argument allows one resource to manage another.
For example, if you have a resource for single articles - `/articles/:articleId` -
and a resource for the collection of articles - `/articles` - you'll want to
indicate that the cache for the latter is stale when you update the former, e.g.:

```javascript
update: (cache) => async (details) => {
  const result = await fetch(path, {
    method: 'post',
    body: JSON.stringify(details),
    header: { 'content-type': 'application/json' }
  });
  cache.for('/articles')?.stale();
  return result;
}
```

Similarly, you may want to have a `delete` method on the collection, and you'll want it
to destroy the article's cache as well, e.g.:

```javascript
'delete': (cache) => async (postId) => {
  // delete the article from the cache.
  cache.for(`/articles/${postId}`)?.state.methods.delete();
  // Return the collection without the deleted post
  return cache.state.data.filter(({ id }) => id !== postId);
},
```

The `cache` object has the following properties:

### `update(updater)`

Accepts an `updater` function of the form `async updater(state)`,
the resolved value of which becomes the new `data` field of the
state.  The `state` field that's passed is identical to what's
returned from `useResource`.

### `destroy()`

Destroys the cache entirely for the given resource.

### `stale()`

Marks the cache stale for the given resource.

### `state`

The current state of the cache for this resource.

### `for(key)`

Return the cache object for another resource, by its key.  If the
resource has not been cached, this is null, so you'll usually want
to chain it conditionally, e.g., `cache.for('other')?.stale()`.

Note that `fetch` does _not_ return an error on a non-OK HTTP code.  You have
to detect and handle that sort of thing yourself.  Ideally, you'd be using [`apiClient`](./apiClient.md).
