import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LikesSummaryProps {
  likes: number;
  dislikes: number;
}

const LikesSummary: React.FC<LikesSummaryProps> = ({ likes, dislikes }) => {
  const netLikes = likes - dislikes;

  return (
    <View style={styles.container}>
      <AntDesign name={'like1'} size={styles.text.fontSize} color="black" />
      <Text style={[styles.text, { color: netLikes >= 0 ? 'green' : 'red' }]}>
        {netLikes}
      </Text>
      <AntDesign name={'dislike1'} size={styles.text.fontSize} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    flexDirection: 'row',
  },
  text: {
    fontSize: 13,
    marginHorizontal: 10,
  },
});

export default LikesSummary;
