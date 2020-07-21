# `useScheduled`

```javascript
const scheduleAction = useScheduled(action, minDelay);
```

Returns a function that will run an action a set amount of time after
invoked, or upon component dismount, whichever comes first.  It's useful
for things like on-change updating of remote resources, where the
invokations come quickly, but you don't want to flood your server with them.

## Example usage:

const ArticleEditor = ({ articleId }) => {
  /* ... */
  const scheduleUpdate = useScheduled((event) => {
    const { name, value } = event.target;
    sendUpdateToServer({ name, value });
  }, 5000);
  /* ... */
  return html`
    <input name="title" value=${article.title} onKeyUp=${scheduleUpdate} />
  `;
};
