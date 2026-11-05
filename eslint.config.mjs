// eslint.config.mjs

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default defineConfig([
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.next/**',
    ],
  },

  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],

    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      prettier,
    ],

    rules: {
      // Variables
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Best practices
      'no-console': 'off',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],

      // Code quality
      'no-var': 'error',
      'prefer-const': 'error',
      'no-constant-condition': 'error',

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
    },
  },
]);
