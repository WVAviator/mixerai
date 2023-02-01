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
          console.log('params', params);
          const searchParams = new URL(params).searchParams;
          const user: User = {
            email: searchParams.get('email') || '',
            displayName: searchParams.get('displayName') || '',
            avatarUrl: searchParams.get('avatarUrl') || '',
            id: searchParams.get('id') || '',
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
