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
import UserProvider from './context/UserProvider';
import LandingScreen, { LandingStackParamList } from './screens/Landing';
import MainScreen, { MainStackParamList } from './screens/Main';
import { User } from './types';

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
      const response = await fetch('https://api.mixerai.app/user');
      if (response.ok) {
        const user: User = await response.json();
        setUser(user);
      }
    };
    const prepareApp = async () => {
      await Promise.all([
        Font.loadAsync({
          Roboto: require('./assets/fonts/Roboto-Regular.ttf'),
          Rajdhani: require('./assets/fonts/Rajdhani-Regular.ttf'),
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
            initialRouteName={'landing'}
            screenOptions={{
              headerShown: false,
              statusBarColor: 'white',
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
