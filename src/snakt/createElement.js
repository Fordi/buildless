import { TEXT } from './enums.js';

export default (type, props, ...children) => ({
  type,
  props: {
    ...props,
    children: children.map(child =>
      typeof child === 'string'
        ? { type: TEXT, props: { nodeValue: child, children: [] } }
        : child
    ),
  },
});
