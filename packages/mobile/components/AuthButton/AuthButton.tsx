import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface AuthButtonProps extends PressableProps {
  startIcon?: React.ReactElement;
  children: string;
  fontSize?: number;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  startIcon,
  children,
  fontSize = 18,
  ...rest
}) => {
  return (
    <View style={styles.outer}>
      <Pressable
        android_ripple={{
          color: '#ffffff20',
          foreground: true,
          borderless: true,
        }}
        {...rest}
      >
        <View style={styles.inner}>
          <View style={styles.fill}>
            {startIcon && (
              <View style={styles.icon}>{React.cloneElement(startIcon)}</View>
            )}
            <Text style={{ ...styles.text, fontSize }}>{children}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    aspectRatio: 255 / 55,
    borderRadius: 8,
    overflow: 'hidden',
  },
  inner: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ffffff',
    borderStyle: 'solid',
    borderRadius: 8,
    height: '100%',
    overflow: 'hidden',
  },
  icon: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // width: 55,
    marginRight: 10,
    aspectRatio: 1,
    height: '100%',
    // backgroundColor: '#000000',
  },
  fill: {
    // backgroundColor: '#000000',
    display: 'flex',
    // flexGrow: 1,
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

export default AuthButton;
