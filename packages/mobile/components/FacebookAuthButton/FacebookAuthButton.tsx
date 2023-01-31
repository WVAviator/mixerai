import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import FacebookIcon from './FacebookIcon';

const FacebookAuthIcon = () => {
  return (
    <View style={styles.outer}>
      <Pressable
        android_ripple={{
          color: '#1877F220',
          foreground: true,
          borderless: true,
        }}
      >
        <View style={styles.inner}>
          <View style={styles.fill}>
            <View style={styles.icon}>
              <FacebookIcon />
            </View>
            <Text style={styles.text}>Login with Facebook</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    width: 255,
    height: 55,
    borderRadius: 4,
    overflow: 'hidden',
  },
  inner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1877F2',
    borderStyle: 'solid',
    borderRadius: 4,
    width: 255,
    height: 55,
    overflow: 'hidden',
  },
  icon: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // width: 55,
    marginRight: 15,
    height: '100%',
    backgroundColor: '#FFFFFF',
  },
  fill: {
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#1877F2',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 19,
  },
});

export default FacebookAuthIcon;
