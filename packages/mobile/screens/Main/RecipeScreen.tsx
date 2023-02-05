import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card, Skeleton, Text } from '@rneui/base';
import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
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
    <>
      <RecipeHeaderBar
        recipe={recipe}
        onBack={() => {
          navigation.goBack();
        }}
      />

      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollview}>
          <Image
            source={{ uri: recipe.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.inner}>
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.description}>{recipe.description}</Text>
            <View style={styles.card}>
              <Text style={styles.heading}>Ingredients</Text>
              <View style={styles.ingredients}>
                {recipe.ingredients.map((ingredient, index) => {
                  return (
                    <>
                      <View key={ingredient.name} style={styles.ingredient}>
                        <Text style={{ marginRight: 16, width: 96 }}>
                          {ingredient.amount}
                        </Text>
                        <Text>{ingredient.name}</Text>
                      </View>
                      {index < recipe.ingredients.length - 1 && (
                        <View style={styles.divider} />
                      )}
                    </>
                  );
                })}
              </View>

              <Text style={styles.heading}>Directions</Text>
              <Text>{recipe.directions}</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  scrollview: {
    paddingVertical: 50,
  },
  inner: {
    padding: 20,
    width: '100%',
    marginBottom: 64,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  card: {
    width: '100%',
    marginVertical: 16,
    backgroundColor: '#fceed6',
    shadowColor: '#5a5a5a',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    padding: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ingredients: {
    marginBottom: 16,
  },
  ingredient: {
    flexDirection: 'row',
  },
  divider: {
    height: 1,
    backgroundColor: '#5a5a5a',
    width: '100%',
  },
});

export default RecipeScreen;
