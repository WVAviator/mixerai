module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@babel/preset-react'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
