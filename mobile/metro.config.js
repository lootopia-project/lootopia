const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path'); // Ajoutez cette ligne pour importer le module path

/**
 * Metro configuration
 * https://docs.expo.dev/guides/customizing-metro/
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.extraNodeModules = {
    'react-native': path.resolve(__dirname, 'node_modules/react-native-web'),
};

// Ajout des extensions spécifiques pour le mode web
defaultConfig.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'web.js', 'web.tsx', ...defaultConfig.resolver.sourceExts];


module.exports = defaultConfig;
