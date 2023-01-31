import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Authentication" component={AuthenticationScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Second" component={SecondScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
