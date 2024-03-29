import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface HeaderProps {
  padding?: number;
  children?: React.ReactNode;
}

const Header: React.FC<React.PropsWithChildren<HeaderProps>> = ({
  children,
  padding = 15,
}) => {
  return (
    <View style={[styles.container, { paddingHorizontal: padding }]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',

    height: 100,
    backgroundColor: '#C0630D',
    overflow: 'hidden',
    zIndex: 1,
    paddingHorizontal: 20,
  },
  inner: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginTop: 40,
    height: 60,
  },
});

export default Header;
