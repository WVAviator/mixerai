import { User } from '../types';

const config = {
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

const linking = {
  prefixes: ['mixerai://app'],
  config,
};

export default linking;
