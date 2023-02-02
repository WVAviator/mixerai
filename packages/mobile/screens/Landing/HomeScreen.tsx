import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LandingStackParamList } from '.';
import Logo from '../../components/Logo/Logo';
import OutlineButton from '../../components/OutlineButton/OutlineButton';

const HomeScreen: React.FC<
  NativeStackScreenProps<LandingStackParamList, 'home'>
> = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Generate unique, custom cocktail recipes from a single prompt.
      </Text>
      <View style={styles.button}>
        <OutlineButton onPress={() => navigation.navigate('auth')}>
          Let's get started
        </OutlineButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 32,
    paddingVertical: 128,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  button: {
    // width: '60%',
    alignSelf: 'flex-start',
    marginVertical: 32,
  },
});

export default HomeScreen;
