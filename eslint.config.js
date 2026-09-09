import pluginVue from 'eslint-plugin-vue'

export default [
  // 'essential' = correctness rules only. The stricter presets add cosmetic
  // template-formatting rules that aren't worth the churn here.
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module'
    },
    rules: {
      // Card and Status are unambiguous in a three-component app.
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    ignores: ['dist/**']
  }
]
