import bachmanDev from "@bachman-dev/eslint-config";
import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    // Replace output folder if needed, e.g. "build"
    ignores: ["dist/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  bachmanDev({ language: "typescript", allowConsole: true }),
  {
    languageOptions: {
      parserOptions: {
        // Non-emitting tsconfig extended from tsconfig.json, including "src" folder, config files, tests, etc.
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["**/*.?(m)js"],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ["**/*.?(m)js"],
    ...bachmanDev({ language: "javascript-in-typescript" }),
  },
  eslintConfigPrettier,
);
