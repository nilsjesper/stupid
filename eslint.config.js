import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'

export default [
  ...tseslint.configs.recommended,

  // 'essential' = correctness rules only. The stricter presets add cosmetic
  // template-formatting rules that aren't worth the churn here.
  ...pluginVue.configs['flat/essential'],

  {
    // eslint-plugin-vue supplies vue-eslint-parser for SFCs; this tells it to
    // hand <script lang="ts"> blocks to the TypeScript parser.
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module'
      }
    }
  },

  {
    rules: {
      // Card and Status are unambiguous in a three-component app.
      'vue/multi-word-component-names': 'off'
    }
  },

  {
    ignores: ['dist/**']
  }
]
