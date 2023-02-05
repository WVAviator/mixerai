import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Recipe, Vote } from '../../types';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import useUserVoting from '../../hooks/useUserVoting';
import Header from '../Header/Header';

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
    <Header padding={0}>
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
    </Header>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',

    height: 100,
    backgroundColor: '#C0630D',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
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
