import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { View } from 'react-native';
import LandingScreen from './screens/Landing';

SplashScreen.preventAutoHideAsync();

export type RootStackParamList = {
  landing: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [appReady, setAppReady] = React.useState(false);

  React.useEffect(() => {
    const prepareApp = async () => {
      await Promise.all([
        Font.loadAsync({
          Roboto: require('./assets/fonts/Roboto-Regular.ttf'),
          Rajdhani: require('./assets/fonts/Rajdhani-Regular.ttf'),
        }),
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
      <NavigationContainer theme={mainTheme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            statusBarColor: 'white',
          }}
        >
          <Stack.Screen name="landing" component={LandingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
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
