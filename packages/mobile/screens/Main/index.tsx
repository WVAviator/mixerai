import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React from 'react';
import { Text } from 'react-native';
import { RootStackParamList } from '../../App';
import Background from '../../components/Background/Background';
import NavigationProvider from '../../context/NavigationProvider/NavigationProvider';
import useUser from '../../hooks/useUser';
import CreateScreen from './CreateScreen';
import DiscoverScreen from './DiscoverScreen';
import MyRecipesScreen from './MyRecipesScreen';
import PurchaseScreen from './PurchaseScreen';
import RecipeScreen from './RecipeScreen';

export type MainStackParamList = {
  discover: undefined;
  recipe: {
    id: string;
  };
  create: undefined;
  myrecipes: undefined;
  purchase: undefined;
};

const Stack = createNativeStackNavigator<MainStackParamList>();

type MainScreenProps = NativeStackScreenProps<RootStackParamList, 'main'>;

const MainScreen: React.FC<MainScreenProps> = ({ navigation }) => {
  const { user } = useUser();

  React.useEffect(() => {
    if (!user) {
      console.log('no user, redirecting to auth screen');
      navigation.navigate('landing', { screen: 'auth' });
    }
  }, [user]);

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
        label: 'Tokens',
        icon: <FontAwesome5 name="coins" size={24} color="white" />,
        onPress: () => {
          navigation.navigate('main', { screen: 'purchase' });
        },
      },
      {
        label: 'My Recipes',
        icon: <FontAwesome5 name="user" size={24} color="white" />,
        onPress: () => {
          navigation.replace('main', { screen: 'myrecipes' });
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

  if (!user) {
    return null;
  }

  return (
    <Background>
      <NavigationProvider
        defaultHeaderProps={defaultHeaderOptions}
        defaultFooterProps={defaultFooterOptions}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            statusBarColor: 'black',
            animation: 'none',
          }}
          initialRouteName="discover"
        >
          <Stack.Screen name="discover" component={DiscoverScreen} />
          <Stack.Screen name="recipe" component={RecipeScreen} />
          <Stack.Screen name="create" component={CreateScreen} />
          <Stack.Screen name="purchase" component={PurchaseScreen} />
          <Stack.Screen name="myrecipes" component={MyRecipesScreen} />
        </Stack.Navigator>
      </NavigationProvider>
    </Background>
  );
};

export default MainScreen;
