import React from 'react';
import { UserContext } from '../context/UserProvider/UserProvider';

const useUser = () => {
  const { user, setUser } = React.useContext(UserContext);
  return { user, setUser };
};

export default useUser;
