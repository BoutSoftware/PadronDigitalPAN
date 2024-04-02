module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "next/core-web-vitals",
  ],
  "overrides": [
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    // "linebreak-style": [
    //   "error",
    //   "unix"
    // ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ],
    // unused imports
    // "@typescript-eslint/no-unused-vars": "error",
    // @next/next/no-page-custom-font
    "@next/next/no-page-custom-font": "off",
    "@next/next/google-font-display": "off",
    // disable exhaustive-deps
    "react-hooks/exhaustive-deps": "off",
  }
};