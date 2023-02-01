import React from 'react';
import Svg, {
  SvgProps,
  G,
  Circle,
  Path,
  Defs,
  ClipPath,
} from 'react-native-svg';

const SvgComponent = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <G clipPath="url(#a)">
      <Circle cx={12} cy={12} r={12} fill="#fff" />
      <Path
        d="M24 12c0-6.624-5.376-12-12-12S0 5.376 0 12c0 5.808 4.128 10.644 9.6 11.76V15.6H7.2V12h2.4V9c0-2.316 1.884-4.2 4.2-4.2h3v3.6h-2.4c-.66 0-1.2.54-1.2 1.2V12h3.6v3.6h-3.6v8.34C19.26 23.34 24 18.228 24 12Z"
        fill="#1877F2"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h24v24H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default SvgComponent;
