export default {
  plugins: {
    "postcss-import": {},
    "postcss-nested": {},
    "postcss-preset-env": {
      stage: 2,
      features: {
        "custom-properties": true,
        gap: true,
        "nesting-rules": false,
      },
    },
    autoprefixer: {},
    "postcss-modules": {
      generateScopedName: "[name]__[local]--[hash:base64:5]",
      localsConvention: "camelCase",
    },
  },
};
