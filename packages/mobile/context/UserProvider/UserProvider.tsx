import React from 'react';
import { User } from '../../types';

export interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const UserContext = React.createContext<UserContextProps>({
  user: null,
  setUser: () => 0,
});

interface UserProviderProps {
  value: UserContextProps;
}

const UserProvider: React.FC<React.PropsWithChildren<UserProviderProps>> = ({
  children,
  value,
}) => {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
