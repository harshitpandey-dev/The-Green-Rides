module.exports = {
  root: true,
  extends: '@react-native',
  parser: 'espree', // Use default parser instead of babel
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Disable some strict rules for React Native development
    'no-unused-vars': 'warn',
    'no-shadow': 'off',
    'no-catch-shadow': 'off',
  },
};


