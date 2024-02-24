module.exports = {
  extends: ["@repo/eslint-config/next.js"],

  parserOptions: {
    project: "/tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
};
