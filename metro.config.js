const { getDefaultConfig } = require('expo/metro-config');

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  
  config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  };
  
  // Define environment variable for web
  process.env.EXPO_OS = process.env.WEB === 'true' ? 'web' : 'native';
  
  return config;
})();