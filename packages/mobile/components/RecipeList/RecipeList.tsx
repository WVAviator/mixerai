import { Image, ListItem } from '@rneui/base';
import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { Recipe } from '../../types';

const cutoffText = (text: string, length: number) => {
  if (text.length > length) {
    const splitText = text.substring(0, length);
    const lastSpace = splitText.lastIndexOf(' ');
    return `${splitText.substring(0, lastSpace)}...`;
  }
  return text;
};

interface RecipeListProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipeList: React.FC<RecipeListProps> = ({ onSelectRecipe }) => {
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const getRecipes = async () => {
    const response = await fetch('https://api.mixerai.app/recipe');
    const data = await response.json();
    setRecipes(data);
  };

  React.useEffect(() => {
    getRecipes();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        showsVerticalScrollIndicator={false}
        style={{ paddingVertical: 32, marginBottom: 10 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            tintColor="#FFFFFF"
            onRefresh={async () => {
              setRefreshing(true);
              const minWait = new Promise((resolve) =>
                setTimeout(resolve, 1000)
              );
              const recipeWait = getRecipes();
              await Promise.all([minWait, recipeWait]);
              setRefreshing(false);
            }}
          />
        }
        renderItem={({ item: recipe, index }) => {
          return (
            <TouchableHighlight
              style={{ marginBottom: index === recipes.length - 1 ? 42 : 0 }}
              onPress={() => {
                onSelectRecipe(recipe);
              }}
            >
              <ListItem style={styles.listItem}>
                <ListItem.Content style={styles.content}>
                  <Image
                    style={styles.image}
                    source={{ uri: recipe.imageUrl }}
                  />
                  <View style={styles.titleContainer}>
                    <ListItem.Title style={[styles.text, styles.title]}>
                      {recipe.title}
                    </ListItem.Title>
                    <ListItem.Subtitle
                      style={[styles.text, styles.description]}
                    >
                      {cutoffText(recipe.description, 100)}
                    </ListItem.Subtitle>
                  </View>
                </ListItem.Content>
              </ListItem>
            </TouchableHighlight>
          );
        }}
        keyExtractor={(recipe) => recipe.id}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  listItem: {
    backgroundColor: '#d4d4d4',
    borderRadius: 6,
    marginVertical: 8,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
  },
  text: {
    color: '#000000',
  },
  image: {
    width: 75,
    height: 75,
    marginRight: 8,
  },
});

export default RecipeList;
