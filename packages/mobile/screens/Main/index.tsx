import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import Background from '../../components/Background/Background';
import DiscoverScreen from './DiscoverScreen';
import React from 'react';
import RecipeScreen from './RecipeScreen';
import BottomNavigation from '../../components/BottomNavigation/BottomNavigation';
import { FontAwesome5 } from '@expo/vector-icons';

export type MainStackParamList = {
  discover: undefined;
  recipe: {
    id: string;
  };
};

const Stack = createNativeStackNavigator<MainStackParamList>();

type MainScreenProps = NativeStackScreenProps<RootStackParamList, 'main'>;

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const navigationRef = React.useRef(null);
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
        <Stack.Screen name="recipe" component={RecipeScreen} />
      </Stack.Navigator>
      <BottomNavigation
        options={[
          {
            label: 'Discover',
            icon: <FontAwesome5 name="compass" size={24} color="white" />,
            onPress: () => {
              navigation.navigate('main', { screen: 'discover' });
            },
          },
          {
            label: 'Create',
            icon: <FontAwesome5 name="plus" size={24} color="white" />,
            onPress: () => {
              navigation.navigate('main', { screen: 'discover' });
            },
          },
          {
            label: 'Profile',
            icon: <FontAwesome5 name="user" size={24} color="white" />,
            onPress: () => {
              navigation.navigate('main', { screen: 'discover' });
            },
          },
        ]}
      />
    </Background>
  );
};

export default MainScreen;
