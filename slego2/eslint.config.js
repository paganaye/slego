import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Global ignores
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      'webroot/**',
      'eslint.config.js',
      '**/vite.config.ts',
      'devvit.config.ts',
    ],
  },
  // Base configs applied to all linted files
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Global rules and parser options
    languageOptions: {
      ecmaVersion: 2023,
      parserOptions: {
        project: ['./tsconfig.json', './src/*/tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-sparse-arrays': 'off',
      'no-unused-vars': 'off',
      'prefer-const': 'off',
    },
  },
  {
    // Node.js environment for server-side code
    files: ['src/server/**/*.{ts,tsx,js,mjs,cjs}', 'src/devvit/**/*.{ts,tsx}', 'tools/**/*.{ts,tsx,mjs,cjs,js}', '*.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // Browser environment for client-side code
    files: ['src/client/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  }
);
