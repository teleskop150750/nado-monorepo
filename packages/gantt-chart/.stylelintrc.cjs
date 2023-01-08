const { propertyOrdering, selectorOrdering } = require('stylelint-semantic-groups')

module.exports = {
  env: {
    node: true,
    browser: true,
    'vue/setup-compiler-macros': true,
  },
  plugins: ['stylelint-order', 'stylelint-color-format', 'stylelint-declaration-block-no-ignored-properties'],
  extends: ['stylelint-config-standard', 'stylelint-config-html/vue', 'stylelint-config-prettier'],
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'deep'],
      },
    ],
    'selector-combinator-space-before': 'always',
    'selector-combinator-space-after': 'always',
    'color-format/format': {
      format: 'hsl',
    },
    'color-function-notation': 'modern',
    'plugin/declaration-block-no-ignored-properties': true,
    'order/order': selectorOrdering,
    'order/properties-order': propertyOrdering,
    'declaration-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'after-declaration', 'first-nested', 'inside-single-line-block'],
      },
    ],

    'length-zero-no-unit': [
      true,
      {
        ignore: ['custom-properties'],
      },
    ],
    'selector-class-pattern': '.*',
  },
}
