import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const GoogleIcon = (props: SvgProps) => (
  <Svg width={24} height={24} fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.255h5.92a5.06 5.06 0 0 1-2.195 3.32v2.76h3.555c2.08-1.915 3.28-4.735 3.28-8.085Z"
      fill="#4285F4"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 23c2.97 0 5.46-.985 7.28-2.665l-3.555-2.76c-.985.66-2.245 1.05-3.725 1.05-2.865 0-5.29-1.935-6.155-4.535H2.17v2.85A10.996 10.996 0 0 0 12 23Z"
      fill="#34A853"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.845 14.09A6.612 6.612 0 0 1 5.5 12c0-.725.125-1.43.345-2.09V7.06H2.17A10.996 10.996 0 0 0 1 12c0 1.775.425 3.455 1.17 4.94l3.675-2.85Z"
      fill="#FBBC05"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 5.375c1.615 0 3.065.555 4.205 1.645l3.155-3.155C17.455 2.09 14.965 1 12 1 7.7 1 3.98 3.465 2.17 7.06l3.675 2.85C6.71 7.31 9.135 5.375 12 5.375Z"
      fill="#EA4335"
    />
  </Svg>
);

export default GoogleIcon;
