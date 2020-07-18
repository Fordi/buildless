useResource
-----------

Inspired by [`useQuery`](https://react-query.tanstack.com/docs/overview), useResource 
is meant to be a much simpler way to do simple cached state sync between an app and
server.

The basic idea is that you define a `Resource`, which is an object containing a String
`key`, an AsyncFunction `get`, and some number of AsyncFunction mutators of arbitrary
names.

Enough talk, let's get to the code:

First, you want to define your resources:

`resources/articles.js`
```javascript
export default ({ page }) => ({
    key: `articles`,
    // In reality, you'd want to build your queries.
    get: async () => fetch(`/api/articles?page=${page}`).then(r => r.json()),
    // Note: you'll want to abstract `fetch` to handle authentication and other concerns, of course
    create: async (state, { title, content, published }) => {
      const lastUpdate = +new Date();
      const newPost = { title, content, published, lastUpdate };
      // Assuming API redirects to the new article, we update the list locally.
      const { id } = await fetch('/api/articles', { method: 'post', body: newPost }).then(r => r.json());
      return [{ id , title, published, lastUpdate }].concat(state);
    }
});
```

`resources/article.js`
```javascript
export default (postId) => ({
  key: `articles/${postId}`,
  get: async () => fetch(`/api/articles/${postId}`).then(r => r.json()),
  update: async ({ title, content, published }) => {
    const article = { title, content, published, lastUpdate: +new Date() };
    await fetch(`api/articles/${postId}`, { method: 'put', body: JSON.stringify(post)});
    // Note: if your API returns the updated post, you can just return that.
    return article;
  },
  delete: async () => {
    
  }
});
```