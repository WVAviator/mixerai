import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../App';

const HomeScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Home'>
> = ({ navigation, route }) => {
  const { user } = route.params;

  return (
    <View style={styles.container}>
      <Text>Hello, {user.displayName}!</Text>
      <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
  },
});

export default HomeScreen;
