module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    // 'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "@typescript-eslint/no-inferrable-types": ["off"],
    "max-len": ["off"],
    "semi": ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "@typescript-eslint/indent": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "quotes": ["error", "single"]
  },
  ignorePatterns: ['.eslintrc.js'],
};
