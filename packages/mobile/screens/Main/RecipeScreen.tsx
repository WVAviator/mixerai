import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Skeleton, Text } from '@rneui/base';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { MainStackParamList } from '.';
import { RootStackParamList } from '../../App';
import Header from '../../components/Header/Header';
import RecipeHeaderBar from '../../components/RecipeHeaderBar/RecipeHeaderBar';
import useHeader from '../../hooks/useHeader';
import useRecipe from '../../hooks/useRecipe';

type RecipeScreenProps = CompositeScreenProps<
  NativeStackScreenProps<MainStackParamList, 'recipe'>,
  NativeStackScreenProps<RootStackParamList, 'main'>
>;

const RecipeScreen: React.FC<RecipeScreenProps> = ({ navigation, route }) => {
  const { recipe, error } = useRecipe(route.params.id);
  useHeader({
    navigation,
    contents: (
      <RecipeHeaderBar recipe={recipe!} onBack={() => navigation.goBack()} />
    ),
    props: {
      padding: 0,
    },
    dependencies: [recipe],
  });

  if (!recipe) {
    return (
      <>
        <Header />
        <Skeleton height={300} />
        <View style={styles.inner}>
          <Skeleton height={50} style={{ marginBottom: 20 }} />
          <Skeleton height={40} style={{ marginBottom: 20 }} />
          <Skeleton height={300} />
        </View>
      </>
    );
  }

  return (
    <>
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
                      <View
                        key={`${recipe.title}-${ingredient.name}`}
                        style={styles.ingredient}
                      >
                        <Text style={{ marginRight: 16, width: 96 }}>
                          {ingredient.amount}
                        </Text>
                        <Text style={{ flexWrap: 'wrap', flex: 1 }}>
                          {ingredient.name}
                        </Text>
                      </View>
                      {index < recipe.ingredients.length - 1 && (
                        <View
                          key={`${recipe.title}-${ingredient.name}-divider`}
                          style={styles.divider}
                        />
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
  scrollview: {},
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
