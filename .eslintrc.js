module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: './tsconfig.json'
  },
rules: {
    '@typescript-eslint/no-shadow': 'warn',
    '@typescript-eslint/no-empty-function': ['error', { allow: ['arrowFunctions'] }],
    '@typescript-eslint/no-unsafe-assignment': ['warn'],
    '@typescript-eslint/no-unsafe-member-access': ['warn'],
    '@typescript-eslint/no-unsafe-return': ['warn'],
    '@typescript-eslint/no-floating-promises': ['off'],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': ['warn'],
    'react/prop-types': ['off'],
    'no-console': 'off',
    semi: ['error', 'never'],
    'import/no-named-as-default': 'off',
  },
}
