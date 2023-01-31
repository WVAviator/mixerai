import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../App';
import GoogleAuthButton from '../components/GoogleAuthButton/GoogleAuthButton';

const AuthenticationScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Authentication'>
> = ({ navigation, route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose a Login Provider</Text>
      <GoogleAuthButton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AuthenticationScreen;
