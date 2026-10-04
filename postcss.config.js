export default {
  plugins: {
    "postcss-import": {},
    "postcss-preset-env": {
      stage: 2,
      features: {
        "custom-properties": true,
        gap: true,
        "nesting-rules": true,
      },
    },
    autoprefixer: {},
  },
};
