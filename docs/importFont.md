# `importFont`

```javascript
const Fonticle = importFont('../assets/Fonticle/Fonticle.woff', '../assets/Fonticle/Fonticle.svg', '../assets/Fonticle/Fonticle.ttf');
```

Imports a font given a set of font file variants, returning the generated internal name for use with `css`.

## Example usage:

```javascript
const Fonticle = importFont('../assets/Fonticle/Fonticle.woff', '../assets/Fonticle/Fonticle.svg', '../assets/Fonticle/Fonticle.ttf');
const styles = css`
  .heading {
    font-face: '${Fonticle}', sans-serif;
  }
`;
```

