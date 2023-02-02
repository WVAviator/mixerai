import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LandingStackParamList } from '.';
import AppleIcon from '../../components/icons/AppleIcon';
import FacebookIcon from '../../components/icons/FacebookIcon';
import GoogleIcon from '../../components/icons/GoogleIcon';
import OutlineButton from '../../components/OutlineButton/OutlineButton';
import { User } from '../../types';

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
    icon: <AppleIcon />,
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
  NativeStackScreenProps<LandingStackParamList, 'auth'>
> = ({ navigation }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      delay: 300,
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
      navigation.navigate('home');
    };
    const subscription = Linking.addEventListener('url', urlListener);
    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>
          Sign in to find or mix your next favorite cocktail.
        </Text>
      </View>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [300, 0],
              }),
            },
          ],
        }}
      >
        <BlurView intensity={90} tint="dark" style={styles.providers}>
          {providers.map((provider) => (
            <View style={styles.provider} key={provider.text}>
              <OutlineButton
                icon={provider.icon}
                fontSize={provider.fontSize}
                onPress={provider.onPress}
                containerStyle={{ width: '100%' }}
                width={256}
              >
                {provider.text}
              </OutlineButton>
            </View>
          ))}
        </BlurView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 32,
    paddingVertical: 128,
  },
  textContainer: {
    width: '100%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingBottom: 156,
  },
  providers: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 20,
    backgroundColor: '#73737384',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  provider: {
    marginVertical: 12,
    width: '100%',
  },
});

export default AuthenticationScreen;
