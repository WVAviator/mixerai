import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import BottomNavigation, {
  BottomNavigationProps,
} from '../../components/BottomNavigation/BottomNavigation';
import Header, { HeaderProps } from '../../components/Header/Header';

interface NavigationContext {
  header: HeaderProps;
  setHeader: React.Dispatch<React.SetStateAction<HeaderProps>>;
  footer: BottomNavigationProps;
  setFooter: React.Dispatch<React.SetStateAction<BottomNavigationProps>>;
}

export const NavigationContext = React.createContext<NavigationContext>({
  header: {},
  setHeader: () => {},
  footer: { options: [] },
  setFooter: () => {},
});

interface NavigationProviderProps {
  defaultHeaderProps?: HeaderProps;
  defaultFooterProps?: BottomNavigationProps;
}

const NavigationProvider: React.FC<
  React.PropsWithChildren<NavigationProviderProps>
> = ({
  children,
  defaultHeaderProps = { padding: 20 },
  defaultFooterProps = { options: [] },
}) => {
  const [header, setHeader] = React.useState<HeaderProps>(defaultHeaderProps);
  const [footer, setFooter] =
    React.useState<BottomNavigationProps>(defaultFooterProps);

  return (
    <NavigationContext.Provider
      value={{ header, setHeader, footer, setFooter }}
    >
      <View style={styles.outer}>
        <Header {...header} />
        <SafeAreaView style={styles.inner}>{children}</SafeAreaView>
        <BottomNavigation {...footer} />
      </View>
    </NavigationContext.Provider>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  inner: {
    flex: 1,
  },
});

export default NavigationProvider;
