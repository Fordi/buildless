import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
export * as Router from 'preact-router';
export * as AsyncRoute from 'preact-async-route';
export * as Match from 'preact-async-route/match';
import htm from 'htm';
import hookResource from './hookResource.js';

export * from 'preact';
export * from 'preact/hooks';
export { css, classes } from './buildless-css';
export const html = htm.bind(h);
export const useResource = hookResource({ useState, useEffect });
