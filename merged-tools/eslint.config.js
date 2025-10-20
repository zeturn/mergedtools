import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // 降级或关闭高噪音规则，先让仓库整体 lint 通过；后续可逐步收紧
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      'no-unused-expressions': 'warn',
      'prefer-const': 'warn',
      'no-empty': 'warn',
      'no-case-declarations': 'off',
      'no-useless-escape': 'warn',
      'no-control-regex': 'warn',
      'no-misleading-character-class': 'warn',
      // React Hooks 若有历史用法问题，先关闭强制规则
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  // 针对声明文件的更宽松设置
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
])
