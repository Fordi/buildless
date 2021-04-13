# v1.3.0

Maintenance dependencies update:

- @babel/cli                                          ^7.12.10  →  ^7.13.14
- @babel/core                                         ^7.12.10  →  ^7.13.15
- @babel/plugin-proposal-nullish-coalescing-operator   ^7.12.1  →   ^7.13.8
- @babel/plugin-proposal-numeric-separator             ^7.12.7  →  ^7.12.13
- @babel/plugin-proposal-optional-chaining             ^7.12.7  →  ^7.13.12
- clean-css                                             ^4.2.3  →    ^5.1.2
- copy-webpack-plugin                                   ^6.4.1  →    ^8.1.1
- webpack                                              ^4.44.2  →   ^5.32.0
- webpack-cli                                          ^3.3.12  →    ^4.6.0

Feature updates:

- Adjusted `asyncComponent` to use a Proxy instead of manually naming expected componentry
- New helper: `makeResolver` - Make a URL resolver to a given base path
- New helper: `importFont` - Import a font given a set of font files

# v1.2.1

Maintenance dependencies update:

- preact 10.5.11 -> 10.5.13

# v1.2.0

- Fixed build process

# v1.1.19

Maintenance dependencies update:

- preact 10.5.9 -> 10.5.11

# v1.1.18

Maintenance dependencies update:

- microbundle 0.12.3 -> 0.13.0
- preact 10.5.7 -> 10.5.9
- babel 7.10.5 -> 7.12.10
- webpack 4.43.0 -> 4.44.2

# v1.1.17

- Improved server
- Keeping up with preact
- Added `apiClient` - Uniformly decorate requests.
- Added `createI18nContext` - Simple and easy internationalization.
- Added `VERSION` string

# v1.1.6

- Includes preact-router - multipage SPAs
- new hook: `useResource` - manage server-side resources easily
- new hook: `useScheduled` - don't spam your server
- new hook: `useUid` - link labels to their inputs with unique IDs
- `asyncComponent` - load components at runtime the lazy way

# v1.0.11

- Improved docs
- Replaced http-serve with a simple express app
- CSS minification
- A build process!

# v1.0.2

- Initial proof-of-concept
