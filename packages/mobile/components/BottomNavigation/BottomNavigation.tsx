import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface NavigationOption {
  icon: React.ReactElement;
  label: string;
  onPress: () => void;
}

export interface BottomNavigationProps {
  options: NavigationOption[];
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ options }) => {
  return (
    <View style={styles.container}>
      {options.map((option, index) => {
        return (
          <TouchableOpacity
            accessibilityLabel={option.label}
            key={option.label}
            onPress={option.onPress}
          >
            <View style={styles.iconContainer}>
              {React.cloneElement(option.icon, {
                size: 26,
              })}
              <Text style={styles.iconText}>{option.label}</Text>
            </View>
            {index < options.length - 1 && <View style={styles.divider} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 85,
    overflow: 'hidden',
    backgroundColor: '#C0630D',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    height: '100%',
  },
  iconContainer: {
    width: 90,
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#fff',
  },
  iconText: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
});

export default BottomNavigation;
