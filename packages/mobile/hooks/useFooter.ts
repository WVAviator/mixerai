import React from 'react';
import { NavigationOption } from '../components/BottomNavigation/BottomNavigation';
import { NavigationContext } from '../context/NavigationProvider/NavigationProvider';

const useFooter = () => {
  const { footer, setFooter } = React.useContext(NavigationContext);

  const setNavigationOptions = (options: NavigationOption[]) => {
    setFooter((footer) => ({ ...footer, options }));
  };

  return { navigationOptions: footer.options, setNavigationOptions };
};

export default useFooter;
