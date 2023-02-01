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
        user: (params: string) => {
          const parsedParams = new URLSearchParams(params);
          const user: User = {
            email: parsedParams.get('email') || '',
            displayName: parsedParams.get('displayName') || '',
            avatarUrl: parsedParams.get('avatarUrl') || '',
            id: parsedParams.get('id') || '',
          };

          return user;
        },
      },
    },
  },
};

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['mixerai://app'],
  config,
};

export default linking;
