import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  {
    files: ['**/*.{js,jsx}'],

    extends: [
      js.configs.recommended,
      react.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],

    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      // 🔥 evita bugs comuns de estrutura de página
      'no-unused-vars': 'warn',
      'no-console': 'warn',

      // 🔥 React Hooks (evita erros sérios de lógica)
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // 🔥 melhora padrão React
      'react/react-in-jsx-scope': 'off', // não necessário no React 17+
      'react/prop-types': 'off', // se você não usa prop-types

      // 🔥 ajuda a manter código mais limpo
      'react/jsx-no-duplicate-props': 'error',
    },
  },
])