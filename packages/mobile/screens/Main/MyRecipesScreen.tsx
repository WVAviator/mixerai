import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MainStackParamList } from '.';
import { RootStackParamList } from '../../App';
import RecipeList from '../../components/RecipeList/RecipeList';
import useHeader from '../../hooks/useHeader';
import useUser from '../../hooks/useUser';
import { Recipe } from '../../types';

type MyRecipesScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'myrecipes'>,
  NativeStackScreenProps<RootStackParamList, 'main'>
>;

const MyRecipesScreen: React.FC<MyRecipesScreenProps> = ({ navigation }) => {
  const { user } = useUser();

  useHeader({
    navigation,
    contents: <Text style={styles.text}>Your Recipes</Text>,
    props: { padding: 20 },
    dependencies: [user],
  });

  return (
    <View style={styles.container}>
      <RecipeList
        onSelectRecipe={(recipe: Recipe) => {
          navigation.navigate('main', {
            screen: 'recipe',
            params: { id: recipe.id },
          });
        }}
        options={{ getByUser: true }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    width: '100%',
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

export default MyRecipesScreen;
