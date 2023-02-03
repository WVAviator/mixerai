import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Animated,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { LandingStackParamList } from '.';
import { RootStackParamList } from '../../App';
import AppleIcon from '../../components/icons/AppleIcon';
import FacebookIcon from '../../components/icons/FacebookIcon';
import GoogleIcon from '../../components/icons/GoogleIcon';
import OutlineButton from '../../components/OutlineButton/OutlineButton';
import useUser from '../../hooks/useUser';
import { User } from '../../types';

interface AuthProvider {
  text: string;
  fontSize?: number;
  icon: React.ReactElement;
  url: string;
}

const providers: AuthProvider[] = [
  {
    text: 'Continue with Apple',
    fontSize: 18,
    icon: <AppleIcon />,
    url: 'https://api.mixerai.app/auth/apple',
  },
  {
    text: 'Continue with Google',
    fontSize: 18,
    icon: <GoogleIcon />,
    url: 'https://api.mixerai.app/auth/google',
  },
  {
    text: 'Continue with Facebook',
    fontSize: 16,
    icon: <FacebookIcon />,
    url: 'https://api.mixerai.app/auth/facebook',
  },
];

type AuthenticationScreenProps = CompositeScreenProps<
  NativeStackScreenProps<LandingStackParamList, 'auth'>,
  NativeStackScreenProps<RootStackParamList, 'landing'>
>;

const AuthenticationScreen: React.FC<AuthenticationScreenProps> = ({
  navigation,
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const { setUser } = useUser();

  const [showWebView, setShowWebView] = React.useState(false);
  const [webViewUrl, setWebViewUrl] = React.useState('');

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      delay: 300,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleProviderPress = async (url: string) => {
    console.log('HandleProviderPress: ', url);
    // setWebViewUrl(url);
    // setShowWebView(true);

    const result = await WebBrowser.openAuthSessionAsync(url);

    if (result.type !== 'success') {
      console.log('Error authenticating through Google: ', result.type);
      return;
    }

    console.log('Successfully authenticated through Google');
    try {
      console.log('Logging in...');
      const authResponse = await fetch('https://api.mixerai.app/user');
      console.log('Received login response. Getting data...');
      const user = await authResponse.json();
      console.log('Got user: ', user);
      setUser(user);
      console.log('Navigating to main screen...');
      navigation.navigate('main', { screen: 'discover' });
    } catch (error) {
      console.log('Error logging in: ', error);
    }
  };

  // const onNavigationStateChange = async (event: WebViewNavigation) => {
  //   const { url, loading } = event;
  //   console.log('url: ', url, 'loading: ', loading);
  //   if (
  //     url.startsWith('https://api.mixerai.app/auth/google/callback') &&
  //     !loading
  //   ) {
  //     const authResponse = await fetch(
  //       'https://api.mixerai.app/auth/google/login'
  //     );
  //     const { user, token } = await authResponse.json();
  //     console.log('Got user: ', user);
  //     console.log('Got token: ', token);
  //     setShowWebView(false);
  //     setUser(user);
  //     navigation.navigate('main', { screen: 'discover' });
  //   }
  // };

  return (
    <>
      {showWebView && (
        <SafeAreaView
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
          }}
        >
          <WebView
            source={{ uri: webViewUrl }}
            // onNavigationStateChange={onNavigationStateChange}
            userAgent={
              Platform.OS === 'android'
                ? 'Chrome/18.0.1025.133 Mobile Safari/535.19'
                : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75'
            }
            sharedCookiesEnabled={true}
          />
        </SafeAreaView>
      )}
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
                  onPress={() => handleProviderPress(provider.url)}
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
    </>
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
