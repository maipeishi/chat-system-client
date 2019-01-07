module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    jquery: true
  },
  extends: 'airbnb-base',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    'global-require': 0,
    'import/no-unresolved': 0,
    'no-param-reassign': 0,
    'no-shadow': 0,
    'import/extensions': 0,
    'import/newline-after-import': 0,
    'no-multi-assign': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    "linebreak-style": [0 ,"error", "windows"],
    "func-names":0,
    "prefer-arrow-callback":0,
    "no-unused-vars":0,
    "no-console":0,
    "keyword-spacing":0,
    "key-spacing":0,
    "no-var":0,
    "space-before-blocks":0,
    "space-infix-ops":0,
    "no-plusplus":0,
    "vars-on-top":0,
    "max-len":0,
    "eqeqeq":0,
    "no-continue":0,
    "object-curly-spacing":0,
    "comma-spacing":0,
    "object-curly-newline":0,
    "indent":0,
    "quotes":0,
    "semi":0,
    "no-multi-spaces":0,
    "space-before-function-paren":0,
    "curly":0,
    "no-underscore-dangle":0,
    "object-shorthand":0,
    "one-var":0,
    "comma-dangle":0,
    "no-trailing-spaces":0,
    "space-unary-ops":0,
    "no-extend-native":0,
    "eol-last":0,
    "no-array-constructor":0,
    "one-var-declaration-per-line":0,
    "no-use-before-define":0,
    "no-bitwise":0,
    "no-else-return":0,
    "camelcase":0,
    "operator-assignment":0,
    "prefer-template":0,
    "no-redeclare":0,
    "block-scoped-var":0,
    "no-confusing-arrow":0,
    "arrow-parens":0,
    "arrow-body-style":0,
    "object-property-newline":0,
    "import/no-extraneous-dependencies":0,
    //socket.io.js
    "spaced-comment":0,
    "block-spacing":0,
    "brace-style":0,
    "yoda":0,
    "semi-spacing":0,
    "no-restricted-properties":0,
    "no-sequences":0,
    "no-unused-expressions":0,
    "prefer-rest-params":0,
    "no-cond-assign":0,
    "lines-around-directive":0,
    "strict":0,
    "no-return-assign":0,
    "switch-colon-spacing":0,
    "default-case":0,
    "no-prototype-builtins":0,
    "prefer-spread":0,
    "wrap-iife":0,
    "no-void":0,
    "no-new-func":0,
    "no-nested-ternary":0,
    "no-useless-escape":0,
    "no-mixed-operators":0,
    "no-loop-func":0,
    "new-cap":0,
    "consistent-return":0,
    "no-empty":0,
    "no-script-url":0,
    "new-parens":0,
    "guard-for-in":0,
    "no-restricted-syntax":0,
    "no-floating-decimal":0,
    "radix":0,
    "no-restricted-globals":0,
    "dot-notation":0,
    "no-undef":0,
    "prefer-destructuring":0,
    "no-useless-return":0
  }
}
