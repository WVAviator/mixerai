import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { LandingStackParamList } from '.';
import { RootStackParamList } from '../../App';
import AppleIcon from '../../components/icons/AppleIcon';
import FacebookIcon from '../../components/icons/FacebookIcon';
import GoogleIcon from '../../components/icons/GoogleIcon';
import OutlineButton from '../../components/OutlineButton/OutlineButton';
import useAuthentication from '../../hooks/useAuthenticate/useAuthentication';
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
  const { authenticate } = useAuthentication('landing/auth');

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      delay: 300,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleProviderPress = async (url: string) => {
    const onSuccessfulAuth = async (user: User) => {
      setUser(user);
      navigation.navigate('main', { screen: 'discover' });
    };

    authenticate(url, onSuccessfulAuth);
  };

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
