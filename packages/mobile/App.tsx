import {
  DefaultTheme,
  NavigationContainer,
  Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Background from './components/Background/Background';
import AuthenticationScreen from './screens/AuthenticationScreen';
import HomeScreen from './screens/HomeScreen';
import SecondScreen from './screens/SecondScreen';
import { useFonts } from 'expo-font';
import { User } from './types';
import linking from './config/linking';

export type RootStackParamList = {
  Home: { user: User };
  Second: { name: string };
  Authentication: {
    user?: User;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [fontsLoaded] = useFonts({
    Helvetica: require('./assets/fonts/Helvetica.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Background>
      <NavigationContainer theme={mainTheme} linking={linking}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            statusBarColor: 'white',
          }}
        >
          <Stack.Screen
            name="Authentication"
            component={AuthenticationScreen}
          />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Second" component={SecondScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Background>
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
