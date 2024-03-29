import { Image, ListItem } from '@rneui/base';
import React from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableHighlight,
  View,
} from 'react-native';
import useRecipeList, {
  RecipeListOptions,
} from '../../hooks/useRecipeList/useRecipeList';
import { Recipe } from '../../types';
import LikesSummary from '../LikesSummary/LikesSummary';

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
  options?: RecipeListOptions;
}

const RecipeList: React.FC<RecipeListProps> = ({
  onSelectRecipe,
  options = {},
}) => {
  const { recipes, refreshing, onRefresh } = useRecipeList(options);

  return (
    <FlatList
      data={recipes}
      showsVerticalScrollIndicator={false}
      style={{ paddingTop: 20 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          tintColor="#FFFFFF"
          onRefresh={onRefresh}
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
                <Image style={styles.image} source={{ uri: recipe.imageUrl }} />
                <View style={styles.titleContainer}>
                  <ListItem.Title style={[styles.text, styles.title]}>
                    {recipe.title}
                  </ListItem.Title>
                  <ListItem.Subtitle style={[styles.text, styles.description]}>
                    {cutoffText(recipe.description, 100)}
                  </ListItem.Subtitle>
                  <LikesSummary
                    likes={recipe.likes}
                    dislikes={recipe.dislikes}
                  />
                </View>
              </ListItem.Content>
            </ListItem>
          </TouchableHighlight>
        );
      }}
      keyExtractor={(recipe) => recipe.id}
    />
  );
};

const styles = StyleSheet.create({
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
