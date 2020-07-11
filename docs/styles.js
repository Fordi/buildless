import { css } from 'https://unpkg.com/@fordi-org/buildless';

import theme from './theme.js';

// This is a stupid thing that just generates a bunch of random keyframe transforms.
const genFrames = (baseRotation) => {
  const filling = (min, max, items, digits) => {
    const x = [];
    const mul = Math.pow(10, digits);
    const div = Math.pow(10, -digits);
    for (let i = 0; i < items; i++) x[i] = Math.random();
    const t = x.reduce((s, v) => s + v, 0);
    return x.map(v => Math.round((v * (max - min) / t + min) * mul) / mul);
  };
  const keyframes = [];
  for (let i = 0; i < 100; i+= 5) {
    const [rotate, skewX, skewY] = filling(-5, 5, 3, 2);
    const [scaleX, scaleY] = filling(-0.25, 0.33, 2, 2);
    const [transX, transY] = filling(-3, 3, 2, 0);
    const transform = `transform: rotate(${baseRotation + rotate}deg) skew(${skewX}deg, ${skewY}deg) scale(${1+scaleX}, ${1+scaleY}) translate(${transX}px, ${transY}px);`
    if (i === 0) {
      keyframes.push(`100% { ${transform} }`);
    }
    keyframes.push(`${i}% { ${transform} }`);
  }
  // Move `100%` to the end
  keyframes.push(keyframes.shift());
  return keyframes.join('\n');
}

const styles = css`
  html, body {
    background-color: ${theme.background};
    color: ${theme.primary};
    font-family: sans-serif;
  }
  .demo {
    width: 50vw;
    margin: 0 auto;
    padding-top: 2rem;
    text-align: center;
  }
  .button {
    border: none;
    background: ${theme.secondary};
    padding: 10px;
    border-radius: calc(10px + 1.6em);
  }
  .button:focus {
    outline: none;
  }
  .button:active {
    background: ${theme.secondaryVariant};
    color: ${theme.primaryVariant};
  }
  .button:hover {
    background: ${theme.secondaryVariant};
  }
  a, a:link, a:visited {
    position: relative;
    color: white;
  }
  a.buildless {
    text-decoration: none;
  }
  a.buildless:hover:before, a.buildless:hover:after {
    animation-duration: 1s;
  }
  a.buildless:before, a.buildless:after {
    color: white;
    position: absolute;
    text-decoration: none;
    top: -0.75em;
    font-size: 0.6em;
    text-shadow: 0 0 2px ${theme.accent}, 0 0 5px ${theme.accent};
    animation: 40s cubic-bezier(0.25, 0.5, 0.75, 0.5) -5s infinite;
  }
  a.buildless:before {
    content: '✧･ﾟ:*✧･ﾟ:*';
    left: 0.5em;
    transform: rotate(-10deg);
    animation-name: wiggle-left !important;
  }
  a.buildless:after {
    content: '*:･ﾟ✧*:･ﾟ✧';
    right: 0.5em;
    transform: rotate(10deg);
    animation-name: wiggle-right !important;
  }
  @keyframes wiggle-left { ${genFrames(-10)} }
  @keyframes wiggle-right { ${genFrames(10)} }
`;

export default styles;
