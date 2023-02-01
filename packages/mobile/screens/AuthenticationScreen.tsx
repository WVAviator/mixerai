import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../App';
import AuthButton from '../components/AuthButton/AuthButton';
import AppleIcon from '../components/icons/AppleIcon';
import FacebookIcon from '../components/icons/FacebookIcon';
import GoogleIcon from '../components/icons/GoogleIcon';
import { User } from '../types';

interface AuthProvider {
  text: string;
  fontSize?: number;
  icon: React.ReactElement;
  onPress: () => void;
}

const providers: AuthProvider[] = [
  {
    text: 'Continue with Apple',
    fontSize: 18,
    icon: <AppleIcon fill={'white'} />,
    onPress: async () => {},
  },
  {
    text: 'Continue with Google',
    fontSize: 18,
    icon: <GoogleIcon />,
    onPress: async () => {
      WebBrowser.openBrowserAsync('https://api.mixerai.app/auth/google');
    },
  },
  {
    text: 'Continue with Facebook',
    fontSize: 16,
    icon: <FacebookIcon />,
    onPress: async () => {},
  },
];

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
      <BlurView intensity={110} tint="dark" style={styles.providers}>
        {providers.map((provider) => (
          <View style={styles.provider} key={provider.text}>
            <AuthButton
              startIcon={provider.icon}
              fontSize={provider.fontSize}
              onPress={provider.onPress}
            >
              {provider.text}
            </AuthButton>
          </View>
        ))}
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
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
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: '#ffffff15',
    borderRadius: 8,
    // marginVertical: 64,
  },
  provider: {
    marginVertical: 12,
  },
});

export default AuthenticationScreen;
