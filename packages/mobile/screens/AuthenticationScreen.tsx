import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../App';
import AppleAuthButton from '../components/AppleAuthButton/AppleAuthButton';
import FacebookAuthIcon from '../components/FacebookAuthButton/FacebookAuthButton';
import GoogleAuthButton from '../components/GoogleAuthButton/GoogleAuthButton';
import { User } from '../types';

const AuthenticationScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Authentication'>
> = ({ navigation }) => {
  React.useEffect(() => {
    const urlListener = ({ url }: { url: string }) => {
      const { queryParams } = Linking.parse(url);
      if (!queryParams || !queryParams.id) {
        return;
      }
      const user: User = {
        displayName: queryParams.displayName as string,
        avatarUrl: queryParams.avatarUrl as string,
        email: queryParams.email as string,
        id: queryParams.id as string,
      };
      navigation.navigate('Home', { user });
    };
    const subscription = Linking.addEventListener('url', urlListener);
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose a Login Provider</Text>
      <View style={styles.providers}>
        <View style={styles.provider}>
          <GoogleAuthButton
            onPress={() =>
              WebBrowser.openAuthSessionAsync(
                'https://api.mixerai.app/auth/google'
              )
            }
          />
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
