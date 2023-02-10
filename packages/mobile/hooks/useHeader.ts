import { NavigationProp } from '@react-navigation/native';
import React from 'react';
import { HeaderProps } from '../components/Header/Header';
import { NavigationContext } from '../context/NavigationProvider/NavigationProvider';

interface HeaderOptions {
  contents: React.ReactNode;
  props?: Omit<HeaderProps, 'children'>;
  navigation: NavigationProp<any>;
  dependencies?: React.DependencyList;
}

const useHeader = ({
  contents: children,
  props,
  navigation,
  dependencies,
}: HeaderOptions) => {
  const { header, setHeader } = React.useContext(NavigationContext);

  const updateHeader = () => {
    if (props) {
      setHeader(() => ({ ...props, children }));
    } else {
      setHeader({ ...header, children });
    }
  };

  React.useEffect(() => {
    if (dependencies) {
      for (const dep of dependencies) {
        if (dep === null || dep === undefined) {
          return;
        }
      }
    }
    updateHeader();
    navigation.addListener('focus', updateHeader);
    return () => {
      navigation.removeListener('focus', updateHeader);
    };
  }, [navigation, ...(dependencies || [])]);
};

export default useHeader;
