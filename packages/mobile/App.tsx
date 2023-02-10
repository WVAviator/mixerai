import { AntDesign, FontAwesome5, Ionicons } from '@expo/vector-icons';
import {
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
  Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { View } from 'react-native';
import UserProvider from './context/UserProvider/UserProvider';
import LandingScreen, { LandingStackParamList } from './screens/Landing';
import MainScreen, { MainStackParamList } from './screens/Main';
import { User } from './types';
import serverInstance from './utilities/serverInstance';

SplashScreen.preventAutoHideAsync();

export type RootStackParamList = {
  landing: NavigatorScreenParams<LandingStackParamList>;
  main: NavigatorScreenParams<MainStackParamList>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [appReady, setAppReady] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const establishSession = async () => {
      try {
        const response = await serverInstance.get('/user');
        setUser(response.data);
      } catch (error) {
        console.log('User is not logged in');
        return;
      }
      console.log('User is logged in');
    };
    const prepareApp = async () => {
      console.log(FontAwesome5.font);
      await Promise.all([
        Font.loadAsync({
          Roboto: require('./assets/fonts/Roboto-Regular.ttf'),
          Rajdhani: require('./assets/fonts/Rajdhani-Regular.ttf'),
          Ionicons: require('./assets/fonts/Ionicons.ttf'),
          FontAwesome5Free_Regular: require('./assets/fonts/FontAwesome5_Regular.ttf'),
          // FontAwesome5Free_Solid: require('./assets/fonts/FontAwesome5_Solid.ttf'),
          AntDesign: require('./assets/fonts/AntDesign.ttf'),
        }),
        establishSession(),
      ]);
      setAppReady(true);
    };
    prepareApp();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  if (!appReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <UserProvider value={{ user, setUser }}>
        <NavigationContainer theme={mainTheme}>
          <Stack.Navigator
            initialRouteName={user ? 'main' : 'landing'}
            screenOptions={{
              headerShown: false,
              statusBarColor: '#C0630D',
              statusBarTranslucent: true,
            }}
          >
            <Stack.Screen name="landing" component={LandingScreen} />
            <Stack.Screen name="main" component={MainScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </View>
  );
}

const mainTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent',
    text: '#fff',
  },
};
