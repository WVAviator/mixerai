import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import BottomNavigation from '../BottomNavigation/BottomNavigation';
import Drink from '../Drink/Drink';

interface BackgroundProps {
  showDrink?: boolean;
  includeNavigation?: boolean;
}

const Background: React.FC<React.PropsWithChildren<BackgroundProps>> = ({
  children,
  showDrink = false,
}) => {
  return (
    <LinearGradient
      style={styles.background}
      colors={['#1F2122', '#222425', '#1b1d1e', '#1F2122', '#1F2122']}
      locations={[0, 0.17, 0.18, 0.4, 1]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
    >
      {showDrink && (
        <View style={styles.drink}>
          <Drink size="75%" />
        </View>
      )}
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  drink: {
    position: 'absolute',
    bottom: 42,
    width: '100%',
  },
});

export default Background;
