import React from 'react';
import { Recipe } from '../types';
import serverInstance from '../utilities/serverInstance';

const useRecipe = (id: string) => {
  const [recipe, setRecipe] = React.useState<Recipe | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getRecipe = async () => {
      try {
        const response = await serverInstance.get(`/recipe/${id}`);
        setRecipe(response.data);
      } catch (error) {
        setError(`Unknown error occurred while fetching recipe data: ${error}`);
      }
    };

    getRecipe();
  }, [id]);

  return { recipe, error };
};

export default useRecipe;
