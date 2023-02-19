import React from 'react';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Circle cx={12} cy={12} r={11} fill="#fff" />
    <Path
      d="M23 12c0-6.072-4.928-11-11-11S1 5.928 1 12c0 5.324 3.784 9.757 8.8 10.78V15.3H7.6V12h2.2V9.25a3.854 3.854 0 0 1 3.85-3.85h2.75v3.3h-2.2c-.605 0-1.1.495-1.1 1.1V12h3.3v3.3h-3.3v7.645C18.655 22.395 23 17.709 23 12Z"
      fill="#1877F2"
    />
  </Svg>
);

export default SvgComponent;
