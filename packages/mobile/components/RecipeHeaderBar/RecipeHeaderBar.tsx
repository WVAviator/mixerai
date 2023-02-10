import { AntDesign, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useUserVoting from '../../hooks/useUserVoting';
import { Recipe } from '../../types';

interface RecipeHeaderBarProps {
  recipe: Recipe;
  onBack: () => void;
}

const RecipeHeaderBar: React.FC<RecipeHeaderBarProps> = ({
  recipe,
  onBack,
}) => {
  const { isLiked, isDisliked, like, dislike } = useUserVoting(recipe.id);

  return (
    <>
      <TouchableOpacity onPress={onBack}>
        <View style={styles.backContainer}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </View>
      </TouchableOpacity>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{recipe.title}</Text>
      </View>
      <View style={styles.votesContainer}>
        <TouchableOpacity onPress={like}>
          <AntDesign
            name={isLiked ? 'like1' : 'like2'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={dislike}>
          <AntDesign
            name={isDisliked ? 'dislike1' : 'dislike2'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  inner: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginTop: 40,
    height: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  backContainer: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  votesContainer: {
    width: 70,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 20,
  },
});

export default RecipeHeaderBar;
