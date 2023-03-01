import React from 'react';
import { Recipe } from '../../types';
import serverInstance from '../../utilities/serverInstance';

export interface RecipeListOptions {
  getByUser?: boolean;
}

const defaultOptions: RecipeListOptions = {
  getByUser: false,
};

const useRecipeList = (options: RecipeListOptions = {}) => {
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const { getByUser } = { ...defaultOptions, ...options };

  const getRecipes = async () => {
    const { data } = await serverInstance.get(getByUser ? '/recipe' : '/feed');
    setRecipes(data);
  };

  React.useEffect(() => {
    getRecipes();
  }, [options]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Ensure the refresh takes at least 1 second for UX
    const minWait = new Promise((resolve) => setTimeout(resolve, 1000));
    const recipeWait = getRecipes();
    await Promise.all([minWait, recipeWait]);
    setRefreshing(false);
  };

  return { recipes, refreshing, onRefresh };
};

export default useRecipeList;
