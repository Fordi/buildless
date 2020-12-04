module.exports = {
  plugins: [
    ['babel-plugin-minify-constant-folding'],
    ['babel-plugin-minify-dead-code-elimination'],
    ['babel-plugin-minify-flip-comparisons'],
    ['babel-plugin-minify-guarded-expressions'],
    ['babel-plugin-minify-infinity'],
    ['babel-plugin-minify-mangle-names'],
    ['babel-plugin-minify-replace'],
    ['babel-plugin-minify-simplify'],
    ['babel-plugin-minify-type-constructors'],
    ['babel-plugin-transform-member-expression-literals'],
    ['babel-plugin-transform-merge-sibling-variables'],
    ['babel-plugin-transform-minify-booleans'],
    ['babel-plugin-transform-property-literals'],
    ['babel-plugin-transform-simplify-comparison-operators'],
    ['babel-plugin-transform-undefined-to-void'],
    ['@babel/plugin-proposal-numeric-separator'],
    ['@babel/plugin-proposal-optional-chaining'],
    ['@babel/plugin-proposal-nullish-coalescing-operator'],
  ]
};
