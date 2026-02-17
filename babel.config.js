module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
        },
      ],
    ],
    plugins: [
      // "nativewind/babel",
      "react-native-reanimated/plugin",
      "react-native-paper/babel",
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "~": "./",
          },
        },
      ],
    ],
  };
};
