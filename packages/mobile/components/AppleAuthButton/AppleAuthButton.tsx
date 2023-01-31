import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppleIcon from './AppleIcon';

const AppleAuthButton = () => {
  return (
    <View style={styles.outer}>
      <Pressable
        android_ripple={{
          color: '#ffffff20',
          foreground: true,
          borderless: true,
        }}
      >
        <View style={styles.inner}>
          <View style={styles.fill}>
            <View style={styles.icon}>
              <AppleIcon fill={'white'} />
            </View>
            <Text style={styles.text}>Sign in with Apple</Text>
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
    borderRadius: 8,
    overflow: 'hidden',
  },
  inner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderStyle: 'solid',
    borderRadius: 8,
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
    marginRight: 10,
    height: '100%',
    backgroundColor: '#000000',
  },
  fill: {
    backgroundColor: '#000000',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontFamily: 'Roboto',
    fontSize: 19,
  },
});

export default AppleAuthButton;
