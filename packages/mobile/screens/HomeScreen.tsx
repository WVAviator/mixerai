import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { RootStackParamList } from '../App';

const HomeScreen: React.FC<
  NativeStackScreenProps<RootStackParamList, 'Home'>
> = ({ navigation, route }) => {
  const [name, setName] = React.useState('');

  return (
    <View style={styles.container}>
      <Text>Home</Text>
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
});

export default HomeScreen;
