import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const GoogleIcon = (props: SvgProps) => (
  <Svg width={26} height={26} fill="none" {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M24.855 12.85c0-.88-.079-1.726-.225-2.538H12.946v4.799h6.676a5.707 5.707 0 0 1-2.475 3.744v3.113h4.01c2.345-2.16 3.698-5.34 3.698-9.118Z"
      fill="#4285F4"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.946 24.973c3.35 0 6.158-1.11 8.21-3.005l-4.01-3.113c-1.11.744-2.531 1.184-4.2 1.184-3.231 0-5.966-2.182-6.941-5.114H1.86v3.214a12.4 12.4 0 0 0 11.086 6.834Z"
      fill="#34A853"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.005 14.925a7.457 7.457 0 0 1-.39-2.357c0-.818.141-1.613.39-2.357V6.995H1.86a12.4 12.4 0 0 0-1.32 5.572 12.4 12.4 0 0 0 1.32 5.57l4.145-3.213Z"
      fill="#FBBC05"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.946 5.096c1.821 0 3.457.626 4.742 1.855l3.558-3.558c-2.148-2.002-4.956-3.23-8.3-3.23A12.4 12.4 0 0 0 1.86 6.995l4.145 3.214c.975-2.932 3.71-5.114 6.941-5.114Z"
      fill="#EA4335"
    />
  </Svg>
);

export default GoogleIcon;
