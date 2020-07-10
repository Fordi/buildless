Production builds
-----------------

So you decided to make an optimized production build.

## Setup

1. If you haven't already, move your entire source code into `./src`.
2. Make sure your app's entry point is named `index.js`, and that this is pulled
in from your index.html.
3. If you haven't already, run `npm init` on your project root
3. Run `npm i -D @fordi-org/buildless`
4. In your `package.json`, get rid of `"main": "index.js"`, and add:
    ```json
    "browser": "dist/index.html",    
    "scripts": {
      "build": "webpack",
      "src": "http-server src",
      "dist": "http-server dist -g",
      "clean": "rm -rf dist"      
    },
    ```
5. Last, create a `webpack.config.js` containing the following:
    ```javascript
    module.exports = require('@fordi-org/buildless/lib/webpack.config.js')();
    ```

## Build

At this point, you should be able to run the following to build and preview a
production build:

`$ npm run build; npm run dist`

You can then upload the contents of `./dist` to your hosting of choice.
