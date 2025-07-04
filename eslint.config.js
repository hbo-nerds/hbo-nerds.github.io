import prettier from "eslint-plugin-prettier";
import vue from "eslint-plugin-vue";

export default [
    {
        files: ["**/*.vue", "**/*.js", "**/*.ts"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        plugins: {
            vue,
            prettier,
        },
        rules: {
            "vue/no-unused-vars": "warn",
            "vue/multi-word-component-names": "off",
            "prettier/prettier": "error",
        },
    },
];
