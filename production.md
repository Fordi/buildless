Production builds
-----------------

So you decided to make an optimized production build.  I mean, the name is
"Buildless", so I don't get it\*, but I can't stop you.

## Setup

1. If you haven't already, move your entire source code into `./src`.

2. Make sure your app's entry point is named `./src/index.js`, and that this is pulled
in from your index.html and replaced with:
    ```html
    <script async defer type="module" src="./index.js"></script>
    ```

    If you need to significantly restructure for this (or you just want to),
    make sure to test that the source still works before continuing.

3. If you haven't made this a node project already:
    1. run `npm init` on your project root.
    2. Run `npm i -D @fordi-org/buildless`.

4. In your `package.json`, get rid of `"main": "index.js"`, and add:
    ```json
    "browser": "dist/index.html",
    "scripts": {
      "build": "buildless-build",
      "src": "buildless-serve src",
      "dist": "buildless-serve prod",
      "clean": "rm -rf dist"      
    },
    ```

## Build

At this point, you should be able to run the following to build and preview a
production build:

`$ npm run build; npm run dist`

You can then upload the contents of `./dist` to your hosting of choice.

-----

\* I mean, I _do_ get it.  My own portfolio site gets its payload cut in half
and performs noticeably better when optimized.  That's just not as funny.
