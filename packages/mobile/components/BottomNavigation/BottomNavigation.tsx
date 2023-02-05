import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface NavigationOption {
  icon: React.ReactElement;
  label: string;
  onPress: () => void;
}

interface BottomNavigationProps {
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
          >
            <View style={styles.iconContainer}>
              {React.cloneElement(option.icon, {
                size: 28,
              })}
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
    height: 90,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
});

export default BottomNavigation;
