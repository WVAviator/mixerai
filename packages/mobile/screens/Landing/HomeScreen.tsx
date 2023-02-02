import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LandingStackParamList } from '.';
import { RootStackParamList } from '../../App';
import OutlineButton from '../../components/OutlineButton/OutlineButton';

type HomeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<LandingStackParamList, 'home'>,
  NativeStackScreenProps<RootStackParamList, 'landing'>
>;

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
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
    alignSelf: 'flex-start',
    marginVertical: 32,
  },
});

export default HomeScreen;
