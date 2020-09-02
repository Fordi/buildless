# `apiClient`

```javascript
const myApiClient = apiClient(request => {
  request.init.headers['X-My-Authorization'] = 'my-secret-key';
});

const data = await myApiClient('/articles');
```

`apiClient` is a wrapper around `fetch` that lets you uniformly decorate requests before sending them
(for things like authentication) and automatically converts their responses into data, converting bad
responses to errors appropriately.

To use it, create a new client by calling `apiClient` with a function that will decorate the
passed object as needed.

Objects are not copied, so be careful: it's possible to inadvertently expose security credentials to
consuming functions.  If you're going to be making an API client that any code but your own is likely
to consume, you'll want to work around that by using a more Redux-like method of modifying objects:

```javascript
const myApiClient = apiClient(request => ({
  ...request,
  init: {
    ...request.init,
    headers: {
      ...headers,
      'X-MyAuthorization': 'my-secret-key'
    },
  },
}));
```

Also exposed is the un-decorated `fetchData` function (equivalent to `apiClient(() => {})`).

HTTP Errors are rejected, as an `HttpError` object.  The body from these errors, if present, is
available on `HttpError.data`, as are `status` and `statusText`.  Parsing errors are rejected
directly.

Currently, `apiClient` supports XML and JSON data types, as determined by the response's
`content-type` header.  If the response is not XML or JSON, but is of major type `text`, the raw
text will be returned as a string.  Any other data is returned as an ArrayBuffer.
