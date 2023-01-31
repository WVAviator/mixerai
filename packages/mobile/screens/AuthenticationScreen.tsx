import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  Linking,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import SafariView from 'react-native-safari-view';
import { RootStackParamList } from '../App';
import AppleAuthButton from '../components/AppleAuthButton/AppleAuthButton';
import FacebookAuthIcon from '../components/FacebookAuthButton/FacebookAuthButton';
import GoogleAuthButton from '../components/GoogleAuthButton/GoogleAuthButton';

const AuthenticationScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Authentication'>
> = ({ navigation, route }) => {
  const { user } = route.params;

  const [uri, setUri] = React.useState<string>('');

  // React.useEffect(() => {
  //   Linking.addEventListener('url', ({ url }) => handleOpenURL(url));
  //   const setUpLinking = async () => {
  //     const url = await Linking.getInitialURL();
  //     if (url) {
  //       handleOpenURL(url);
  //     }
  //   };
  //   setUpLinking();
  //   return () => {
  //     Linking.removeAllListeners('url');
  //   }
  // }, []);

  // const handleOpenUrl = (url) => {

  // }

  if (user) {
    navigation.navigate('Home', { user });
  }

  const openUrl = (url: string) => {
    if (Platform.OS === 'ios') {
      SafariView.show({
        url,
        fromBottom: true,
      });
    } else {
      setUri(url);
    }
  };

  if (uri) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          source={{ uri }}
          userAgent={
            Platform.OS === 'android'
              ? 'Chrome/18.0.1025.133 Mobile Safari/535.19'
              : 'AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75'
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose a Login Provider</Text>
      <View style={styles.providers}>
        <View style={styles.provider}>
          <GoogleAuthButton
            onPress={() => openUrl(`http://localhost:4000/auth/google`)}
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
