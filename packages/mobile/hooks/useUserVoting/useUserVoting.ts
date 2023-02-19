import React from 'react';
import serverInstance from '../../utilities/serverInstance';

const useUserVoting = (recipeId: string) => {
  const [userVote, setUserVote] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getUserVote = async () => {
      const { data } = await serverInstance.get(`/vote/${recipeId}`);
      setUserVote(data?.vote ?? null);
    };

    getUserVote();
  }, []);

  const postNewVote = async (newVote: 'like' | 'dislike') => {
    try {
      await serverInstance.post(`/vote/${recipeId}`, { vote: newVote });
      setUserVote(newVote);
    } catch (error) {
      console.log(error);
    }
  };

  const updateVote = async (newVote: 'like' | 'dislike') => {
    try {
      await serverInstance.patch(`/vote/${recipeId}`, { vote: newVote });
      setUserVote(newVote);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteVote = async () => {
    try {
      await serverInstance.delete(`/vote/${recipeId}`);
      setUserVote(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVote = async (newVote: 'like' | 'dislike') => {
    if (userVote === null) {
      await postNewVote(newVote);
    } else if (userVote === newVote) {
      await deleteVote();
    } else {
      await updateVote(newVote);
    }
  };

  return {
    isLiked: userVote === 'like',
    isDisliked: userVote === 'dislike',
    like: () => handleVote('like'),
    dislike: () => handleVote('dislike'),
  };
};

export default useUserVoting;
