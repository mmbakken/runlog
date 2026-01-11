import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'
import prettierConfig from 'eslint-config-prettier'

export default tseslint.config(
  {
    // Applies ignore rules to all configs below.
    ignores: ['dist/*'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // TS linting.
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // Rule overrides
      'react/prop-types': 0,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
      ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,
    },
    settings: {
      react: { version: '19.2.3' },
      'better-tailwindcss': {
        entryPoint: 'src/styles/root.css',
      },
    },
  },

  // JS linting. Similar plugins/rules as above.
  {
    files: ['**/*.js', '**/*.jsx'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: {
      ...tseslint.configs.disableTypeChecked.languageOptions,
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ...tseslint.configs.disableTypeChecked.languageOptions.parserOptions,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      ...tseslint.configs.disableTypeChecked.plugins,
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    rules: {
      ...tseslint.configs.disableTypeChecked.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // Rule overrides
      'react/prop-types': 0,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
      ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,
    },
    settings: {
      ...tseslint.configs.disableTypeChecked.settings,
      react: { version: '19.2.3' },
      'better-tailwindcss': {
        entryPoint: 'src/styles/root.css',
      },
    },
  },

  // Keep last.
  prettierConfig
)
