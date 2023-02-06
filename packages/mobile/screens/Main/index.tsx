import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Background from '../../components/Background/Background';
import DiscoverScreen from './DiscoverScreen';

export type MainStackParamList = {
  discover: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

type MainScreenProps = NativeStackScreenProps<RootStackParamList, 'main'>;

const MainScreen: React.FC<MainScreenProps> = () => {
  return (
    <Background>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          statusBarColor: 'white',
          animation: 'none',
        }}
        initialRouteName="discover"
      >
        <Stack.Screen name="discover" component={DiscoverScreen} />
      </Stack.Navigator>
    </Background>
  );
};

export default MainScreen;