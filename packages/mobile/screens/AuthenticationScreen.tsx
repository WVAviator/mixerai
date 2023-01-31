import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../App';
import AppleAuthButton from '../components/AppleAuthButton/AppleAuthButton';
import FacebookAuthIcon from '../components/FacebookAuthButton/FacebookAuthButton';
import GoogleAuthButton from '../components/GoogleAuthButton/GoogleAuthButton';

const AuthenticationScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Authentication'>
> = ({ navigation, route }) => {
  const { user } = route.params;

  if (user) {
    navigation.navigate('Home', { user });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose a Login Provider</Text>
      <View style={styles.providers}>
        <View style={styles.provider}>
          <GoogleAuthButton />
        </View>
        <View style={styles.provider}>
          <AppleAuthButton />
        </View>
        <View style={styles.provider}>
          <FacebookAuthIcon />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingVertical: 100,
  },
  providers: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  provider: {
    marginVertical: 20,
  },
});

export default AuthenticationScreen;
