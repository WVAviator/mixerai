import { LinkingOptions, PathConfigMap } from '@react-navigation/native';
import { RootStackParamList } from '../App';
import { User } from '../types';

type LinkingConfig =
  | {
      initialRouteName?: keyof RootStackParamList | undefined;
      screens: PathConfigMap<RootStackParamList>;
    }
  | undefined;

const config: LinkingConfig = {
  screens: {
    Authentication: {
      path: 'Authentication/:params',
      parse: {
        user: (params: string) =>
          params.split('/').reduce((acc, param) => {
            const [key, value] = param.split('=');
            return { ...acc, [key]: value };
          }, {} as User),
      },
    },
  },
};

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['mixerai://app'],
  config,
};

export default linking;
