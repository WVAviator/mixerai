import React from 'react';
import { StyleSheet, View } from 'react-native';

const Background: React.FC<React.PropsWithChildren> = ({ children }) => {
  return <View style={styles.background}>{children}</View>;
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor:
      'linear-gradient(0deg, rgba(33,33,33,1) 0%, rgba(147,147,147,1) 5%, rgba(69,69,69,1) 40%, rgba(69,69,69,1) 100%)',
  },
});

export default Background;
