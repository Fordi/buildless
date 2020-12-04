import { classes, css } from './buildless-css.js';

describe('classes', () => {
  it('creates a filtered class list with early duplicates folded', () => {
    expect(classes('one', false && 'two', 'three', 'one').toString()).toBe('three one')
  });
  it('is chainable', () => {
    expect(classes('one')(false && two).and('three')('one').toString()).toBe('three one');
  });
});
const localMath = global.Math;
describe('css', () => {
  beforeEach(() => {
    const mockMath = Object.create(global.Math);
    // ensures that Math.random().toString(36) always returns 0.deadbeef
    mockMath.random = () => 0.3721358433517089;
    global.Math = mockMath;
  });
  afterEach(() => {
    for (const sheet of document.querySelectorAll('head>style')) {
      sheet.parentNode.removeChild(sheet);
    };
    global.Math = localMath;
  });
  it('returns a hash of class names', () => {
    const styles = css`
      .one {
        padding: 0;
      }
      .two {
        margin: 0;
        animation-name: snarf;
      }
      .three {
        animation: snarf 5s linear 2s infinite alternate;
      }
      @keyframes snarf {
        0% { border: 1px solid black; }
        100% { border: 100px solid white; }
      }
    `;
    const sheets = document.querySelectorAll('style');
    expect(sheets.length).toBe(1);
    ['one', 'two', 'three'].forEach(name => {
      expect(styles[name]).toBeDefined();
      expect(styles[name].toString()).not.toBe(name);
      expect(styles[name].toString()).toBe(`${name}_deadbeef`);
    });
    expect(sheets[0].sheet).toMatchSnapshot();
  });
});
