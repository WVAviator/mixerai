import React from 'react';
import { NavigationContext } from '../context/NavigationProvider/NavigationProvider';

const useHeader = () => {
  const { header, setHeader } = React.useContext(NavigationContext);

  const setHeaderContents = (children: React.ReactNode) => {
    setHeader((header) => ({ ...header, children }));
  };

  const setHeaderPadding = (padding: number) => {
    setHeader((header) => ({ ...header, padding }));
  };

  return { header, setHeaderContents, setHeaderPadding };
};

export default useHeader;
