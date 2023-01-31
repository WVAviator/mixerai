import React from 'react';
import Svg, { SvgProps, G, Path, Defs, ClipPath } from 'react-native-svg';

const FacebookIcon = (props: SvgProps) => (
  <Svg width={32} height={32} fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path
        d="M32 16c0-8.832-7.168-16-16-16S0 7.168 0 16c0 7.744 5.504 14.192 12.8 15.68V20.8H9.6V16h3.2v-4c0-3.088 2.512-5.6 5.6-5.6h4v4.8h-3.2c-.88 0-1.6.72-1.6 1.6V16h4.8v4.8h-4.8v11.12C25.68 31.12 32 24.304 32 16Z"
        fill="#1877F2"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h32v32H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

export default FacebookIcon;
