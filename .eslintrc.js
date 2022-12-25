module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'plugin:@next/next/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-param-reassign': [2, {
      props: true,
      ignorePropertyModificationsFor: ['state', 'draftState'],
    }],
    'import/extensions': [2, 'ignorePackages', {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
    }],
    'import/prefer-default-export': 0,
    'react/jsx-filename-extension': [2, {
      extensions: ['.jsx', '.tsx'],
    }],
    'react/jsx-props-no-spreading': [2, {
      html: 'enforce',
      custom: 'ignore',
      explicitSpread: 'enforce',
    }],
    'react/jsx-uses-react': 0,
    'react/react-in-jsx-scope': 0,
    'react/prop-types': 0,
    'react/function-component-definition': [2, { namedComponents: 'arrow-function' }],
  },
};
