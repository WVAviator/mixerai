import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

interface DrinkProps {
  size?: number | string;
}

const Drink: React.FC<DrinkProps> = ({ size = '100%' }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('assets/images/drink_001.png')}
        style={{ ...styles.image, width: size }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
    width: '100%',
    padding: 16,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
});

export default Drink;
