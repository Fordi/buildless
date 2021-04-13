import { h, createContext } from 'preact';
import * as _hooks from 'preact/hooks';

import _useResource from './hooks/useResource/index.js';
import _useUid from './hooks/useUid.js';
import _useScheduled from './hooks/useScheduled.js';
import _createI18nContext from './createI18nContext.js';
import _asyncComponents from './asyncComponents.js';

export * from 'preact';
export * from 'preact/hooks';
export * from 'preact-router';
export * from 'preact-router/match';
export * from './buildless-css.js';
export * from './apiClient.js';
export * from './makeResolver.js';
export * from './importFont.js';

const _inject = { ..._hooks, createElement: h, createContext };

export const useResource = _useResource(_inject);
export const useUid = _useUid(_inject);
export const useScheduled = _useScheduled(_inject);
export const { asyncComponent, asyncComponents } = _asyncComponents(_inject);
export const createI18nContext = _createI18nContext(_inject);

export const VERSION = '1.3.1';
