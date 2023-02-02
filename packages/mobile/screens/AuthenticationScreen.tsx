import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
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
      WebBrowser.openAuthSessionAsync('https://api.mixerai.app/auth/google');
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
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

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
      <Text style={styles.heading}>
        Sign in to find or mix your next favorite cocktail.
      </Text>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [150, 0], // 0 : 150, 0.5 : 75, 1 : 0
              }),
            },
          ],
        }}
      >
        <BlurView intensity={90} tint="dark" style={styles.providers}>
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
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingVertical: 100,
    textAlign: 'center',
  },
  providers: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: '#ffffff15',
    borderRadius: 8,
    overflow: 'hidden',
    // marginVertical: 64,
  },
  provider: {
    marginVertical: 12,
  },
});

export default AuthenticationScreen;
