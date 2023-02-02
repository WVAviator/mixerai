import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LogoIcon from '../icons/LogoIcon';

interface SizePreset {
  iconScale: number;
  fontSize: number;
  marginRight: number;
  textTop: number;
}

const SIZE_PRESETS: Record<string, SizePreset> = {
  small: {
    iconScale: 1,
    fontSize: 18,
    marginRight: -6,
    textTop: 4,
  },
  medium: {
    iconScale: 1.5,
    fontSize: 29,
    marginRight: 0,
    textTop: 6,
  },
  large: {
    iconScale: 2.5,
    fontSize: 48,
    marginRight: 8,
    textTop: 8,
  },
};

interface LogoProps {
  textColor?: 'white' | 'black';
  size?: keyof typeof SIZE_PRESETS;
}

const Logo: React.FC<LogoProps> = ({ textColor = 'white', size = 'large' }) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          ...styles.logoWrapper,
          marginRight: SIZE_PRESETS[size].marginRight,
        }}
      >
        <LogoIcon scale={SIZE_PRESETS[size].iconScale} />
      </View>
      <View
        style={{ ...styles.textWrapper, marginTop: SIZE_PRESETS[size].textTop }}
      >
        <Text
          style={{
            ...styles.text,
            fontSize: SIZE_PRESETS[size].fontSize,
            color: textColor,
          }}
        >
          MIXER
        </Text>
        <Text
          style={{
            ...styles.text,
            fontSize: SIZE_PRESETS[size].fontSize,
            color: '#C0630D',
          }}
        >
          AI
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  logoWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Rajdhani',
  },
});

export default Logo;
