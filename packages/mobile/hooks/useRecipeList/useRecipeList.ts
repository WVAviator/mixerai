import React from 'react';
import { Recipe } from '../../types';
import serverInstance from '../../utilities/serverInstance';

const useRecipeList = () => {
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const getRecipes = async () => {
    const { data } = await serverInstance.get('/feed');
    setRecipes(data);
  };

  React.useEffect(() => {
    getRecipes();
  }, []);

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
