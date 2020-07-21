import { createElement } from 'preact';
import * as _hooks from 'preact/hooks';
import _Router from 'preact-router';

import _useResource from './hooks/useResource/index.js';
import _useUid from './hooks/useUid.js';
import _useScheduled from './hooks/useScheduled.js';
import _asyncComponent from './asyncComponent.js';

export const Router = _Router;

export * from 'preact';
export * from 'preact/hooks';
export * from './buildless-css.js';

const _inject = { ..._hooks, createElement };

export const useResource = _useResource(_inject);
export const useUid = _useUid(_inject);
export const useScheduled = _useScheduled(_inject);
export const asyncComponent = _asyncComponent(_inject);