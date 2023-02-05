import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MainStackParamList } from '.';
import { RootStackParamList } from '../../App';
import Header from '../../components/Header/Header';
import RecipeList from '../../components/RecipeList/RecipeList';
import useUser from '../../hooks/useUser';
import { Recipe } from '../../types';

type DiscoverScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'discover'>,
  NativeStackScreenProps<RootStackParamList, 'main'>
>;

const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  navigation,
  route,
}) => {
  const { user } = useUser();

  React.useEffect(() => {
    if (!user) {
      console.log('no user, redirecting to auth screen');
      navigation.navigate('landing', { screen: 'auth' });
    }
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Header>
        <Text style={styles.text}>Welcome, {user.displayName}!</Text>
      </Header>
      <View style={styles.container}>
        <RecipeList
          onSelectRecipe={(recipe: Recipe) => {
            navigation.navigate('main', {
              screen: 'recipe',
              params: { id: recipe.id },
            });
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 32,
    paddingVertical: 128,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  button: {
    alignSelf: 'flex-start',
    marginVertical: 32,
  },
});

export default DiscoverScreen;
