import React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface LogoIconProps extends SvgProps {
  scale?: number;
}

const LogoIcon: React.FC<LogoIconProps> = ({ scale = 1, ...rest }) => (
  <Svg
    width={24}
    height={24}
    fill="none"
    style={{ transform: [{ scale }], margin: 6 * scale }}
    {...rest}
  >
    <Path
      d="M10.305 22h3.71m3.71 0h-3.71m0 0v-6.278m0 0 5.566-6.85m-5.566 6.85L6.167 6.018l-.428-.57h16.553l-.428.57-2.284 2.854m0 0h-7.562"
      stroke="#C0630D"
      strokeWidth={0.865}
    />
    <Path
      d="M9.735 5.447a3.91 3.91 0 0 0-.904-2.492 4.16 4.16 0 0 0-2.317-1.403 4.272 4.272 0 0 0-2.717.298 4.07 4.07 0 0 0-1.932 1.87 3.87 3.87 0 0 0-.301 2.624c.21.883.725 1.67 1.46 2.233a4.233 4.233 0 0 0 2.584.866 4.231 4.231 0 0 0 2.579-.88L5.739 5.447h3.996Z"
      stroke="#C0630D"
      strokeWidth={0.894}
    />
  </Svg>
);

export default LogoIcon;
