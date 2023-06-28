import { Button, ButtonProps } from '@rneui/base';
import React from 'react';
import { View } from 'react-native';

interface OutlineButtonProps extends ButtonProps {
  width?: number | string;
  fontSize?: number;
}

const OutlineButton: React.FC<OutlineButtonProps> = ({
  width,
  fontSize = 18,
  ...rest
}) => {
  return (
    <View style={{ width }}>
      <Button
        type="outline"
        buttonStyle={{
          borderColor: '#ffffff',
          backgroundColor: 'transparent',
          borderRadius: 6,
          paddingHorizontal: 16,
          paddingVertical: 10,
          justifyContent: rest.icon ? 'flex-start' : 'center',
        }}
        titleStyle={{
          color: '#ffffff',
          marginLeft: rest.icon ? 16 : 0,
          fontFamily: 'Roboto',
          fontSize,
        }}
        {...rest}
      />
    </View>
  );
};

export default OutlineButton;
