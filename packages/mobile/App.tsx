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

export type RootStackParamList = {
  Home: undefined;
  Second: { name: string };
  Authentication: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Background>
      <NavigationContainer theme={mainTheme}>
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
