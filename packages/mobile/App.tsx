import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createTheme, ThemeProvider } from '@rneui/themed';
import { useFonts } from 'expo-font';
import LandingScreen from './screens/Landing';

export type RootStackParamList = {
  landing: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    Roboto: require('./assets/fonts/Roboto-Regular.ttf'),
    Rajdhani: require('./assets/fonts/Rajdhani-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
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
