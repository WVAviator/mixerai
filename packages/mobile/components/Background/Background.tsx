import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Drink from '../Drink/Drink';

const Background: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <LinearGradient
      style={styles.background}
      colors={['#1F2122', '#1F2122', '#262829', '#1F2122', '#1F2122']}
      locations={[0, 0.1, 0.25, 0.26, 1]}
      start={{ x: 0.45, y: 1 }}
      end={{ x: 0.5, y: 0 }}
    >
      <View style={styles.drink}>
        <Drink size="75%" />
      </View>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  drink: {
    position: 'absolute',
    bottom: '10%',
    width: '100%',
  },
});

export default Background;
