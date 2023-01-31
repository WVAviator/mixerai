import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet } from 'react-native';

const Background: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <LinearGradient
      style={styles.background}
      colors={['#4f4f4f', '#303030', '#303030']}
      locations={[0, 0.4, 1]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 35,
  },
});

export default Background;
