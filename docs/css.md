# `css`

```javascript
const { widget } = css`
  .widget {
    property: value;
    another-property: anotherValue;
  }
`;
```

This is a minimalist CSS-in-JS tagged template that seeks to provide the same
benefit as CSS modules in a webpack/node build environment, but lets you work
on a component's CSS co-located with the component, and running natively
in-browser.

Accepts a simple templated stylesheet.  `css` adds a unique slug to each class
name in the stylesheet, injects it into the document, and returns an object
mapping the original class names to their slugged values, wrapped in a
[`classes`](./classes.md) object.

## Example:

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