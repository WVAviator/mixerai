import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import GoogleIcon from './GoogleIcon';

interface GoogleAuthButtonProps extends PressableProps {}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = (props) => {
  return (
    <View style={styles.pressable}>
      <Pressable
        android_ripple={{
          color: '#ffffff35',
          borderless: true,
          foreground: true,
          radius: 148,
        }}
        {...props}
      >
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <GoogleIcon />
          </View>
          <View style={styles.fill}>
            <Text style={styles.text}>Sign in with Google</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: 255,
    height: 55,
    borderRadius: 2.76,
    overflow: 'hidden',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#4285F4',
    borderStyle: 'solid',
    borderRadius: 2.76,
    width: 255,
    height: 55,
    overflow: 'hidden',
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    height: '100%',
    backgroundColor: '#fff',
  },
  fill: {
    backgroundColor: '#4285F4',
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

export default GoogleAuthButton;
