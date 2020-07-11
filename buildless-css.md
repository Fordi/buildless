`buildless-css`
---------------

This is a minimalist CSS-in-JS tagged template that seeks to provide the same
benefit as CSS modules in a webpack/node build environment, but lets you work
on a component's CSS co-located with the component, and running natively
in-browser.  The general form is as follows:

```javascript
import { html, css } from 'https://unpkg.com/@fordi-org/buildless';
import { colors } from './theme.js'
const styles = css`
  .about {
    background: ${colors.background};
    color: ${colors.text};
  }
`;

export default ({ isBlue }) => html`
  <article className=${styles.about.and('some-other-style', isBlue && 'about--blue')}>
    <h1>About</h1>
    <p>
      Neat stuff goes here
    </p>
  </article>
`;
```

This will work uncompiled, but also, the production build will automagically
minify any CSS used here.

What `css` returns is an object containing decorated class names.  Technically,
they're objects with a `toString()` function, plus an `and(...classList)`
member, which accepts a list of classNames and falsy values (which are skipped).

If you need to write a list of regular (non-parsed) class names (for example, to
add to a `className` prop, or to reference global styles), you can use the
export `classes(...classList)`, which works in exactly the same way, e.g.,

```javascript
  export default ({ isFeatured, children }) => html`
    <article className=${classes('main', isFeatured && 'main--featured')}>
      ${children}
    </article>
  `;
```

Both `and()` and `classes()` return decorated class name objects, so you can
chain away to your heart's content.
