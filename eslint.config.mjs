import globals from "globals";
import pluginJs from "@eslint/js";
import stylisticJs from '@stylistic/eslint-plugin-js'

/** @type {import('eslint').Linter.Config[]} */

export default [{
  ignores: ["dist/**"],
},
pluginJs.configs.recommended,
{
  files: ["**/*.js"],
  languageOptions: {
    sourceType: "commonjs",
    globals: {
      ...globals.node,
    },
    ecmaVersion: "latest",
  },
  plugins: {
    '@stylistic/js': stylisticJs
  }

}
]