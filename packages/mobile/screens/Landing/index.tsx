import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Background from '../../components/Background/Background';
import AuthenticationScreen from './AuthenticationScreen';
import HomeScreen from './HomeScreen';

export type LandingStackParamList = {
  home: undefined;
  auth: undefined;
};

const Stack = createNativeStackNavigator<LandingStackParamList>();

const LandingScreen = () => {
  return (
    <Background showDrink={true}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          statusBarColor: 'white',
          animation: 'none',
        }}
      >
        <Stack.Screen name="home" component={HomeScreen} />
        <Stack.Screen name="auth" component={AuthenticationScreen} />
      </Stack.Navigator>
    </Background>
  );
};

export default LandingScreen;
