import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, Skeleton, Text } from '@rneui/base';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { MainStackParamList } from '.';
import { RootStackParamList } from '../../App';
import RecipeHeaderBar from '../../components/RecipeHeaderBar/RecipeHeaderBar';
import { Recipe } from '../../types';

type RecipeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'recipe'>,
  NativeStackScreenProps<RootStackParamList, 'main'>
>;

const RecipeScreen: React.FC<RecipeScreenProps> = ({ navigation, route }) => {
  const [recipe, setRecipe] = React.useState<Recipe | null>(null);

  React.useEffect(() => {
    const getRecipe = async () => {
      const response = await fetch(
        `https://api.mixerai.app/recipe/${route.params.id}`
      );
      const recipe = await response.json();
      setRecipe(recipe);
    };

    getRecipe();
  }, []);

  if (!recipe) {
    return <Skeleton />;
  }

  return (
    <RecipeHeaderBar
      recipe={recipe}
      onBack={() => {
        navigation.goBack();
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  wrapper: {
    marginVertical: 32,
  },
  ingredient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default RecipeScreen;
