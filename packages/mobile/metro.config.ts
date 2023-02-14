// Learn more https://docs.expo.dev/guides/monorepos
import { getDefaultConfig } from 'expo/metro-config';
import path from 'path';
// const { getDefaultConfig } = require('expo/metro-config');
// const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
// This can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      assetExts: assetExts.filter((ext: string) => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      disableHierarchicalLookup: true,
      nodeModulesPaths: [
        path.resolve(projectRoot, 'node_modules'),
        path.resolve(workspaceRoot, 'node_modules'),
      ],
    },
    watchFolders: [workspaceRoot],
  };
})();

module.exports = config;
