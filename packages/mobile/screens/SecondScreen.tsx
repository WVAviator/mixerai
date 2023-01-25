import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../App';

const SecondScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Second'>
> = ({ route }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello, {route.params.name}</Text>
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
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SecondScreen;
