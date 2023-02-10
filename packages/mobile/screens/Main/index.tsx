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
import { AntDesign } from '@expo/vector-icons';
import CreateScreen from './CreateScreen';
import useUser from '../../hooks/useUser';
import { Text } from 'react-native';
import NavigationProvider from '../../context/NavigationProvider/NavigationProvider';

export type MainStackParamList = {
  discover: undefined;
  recipe: {
    id: string;
  };
  create: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

type MainScreenProps = NativeStackScreenProps<RootStackParamList, 'main'>;

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const { user } = useUser();

  const defaultFooterOptions = {
    options: [
      {
        label: 'Discover',
        icon: <FontAwesome5 name="compass" size={24} color="white" />,
        onPress: () => {
          navigation.replace('main', { screen: 'discover' });
        },
      },
      {
        label: 'Create',
        icon: <AntDesign name="plussquareo" size={24} color="white" />,
        onPress: () => {
          navigation.navigate('main', { screen: 'create' });
        },
      },
      {
        label: 'Profile',
        icon: <FontAwesome5 name="user" size={24} color="white" />,
        onPress: () => {
          navigation.navigate('main', { screen: 'discover' });
        },
      },
    ],
  };

  const defaultHeaderOptions = {
    padding: 20,
    children: (
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#ffffff',
        }}
      >
        Welcome, {user?.displayName}!
      </Text>
    ),
  };

  return (
    <Background>
      <NavigationProvider
        defaultHeaderProps={defaultHeaderOptions}
        defaultFooterProps={defaultFooterOptions}
      >
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
          <Stack.Screen name="create" component={CreateScreen} />
        </Stack.Navigator>
      </NavigationProvider>
    </Background>
  );
};

export default MainScreen;
