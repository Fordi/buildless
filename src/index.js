import { h } from 'preact';
import htm from 'htm';
export * from 'preact';
export * from 'preact/hooks';
export { css, classes } from './buildless-css';
export const html = htm.bind(h);
