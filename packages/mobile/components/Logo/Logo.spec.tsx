import { render, screen } from '@testing-library/react-native';
import React from 'react';

import Logo from './Logo';

describe('Logo', () => {
  it('renders correctly', () => {
    render(<Logo />);
    const logo = screen.queryAllByTestId('logo');
    expect(logo).toHaveLength(1);
  });

  it('accepts small, medium, and large size preset props', () => {
    render(
      <>
        <Logo size="small" />
        <Logo size="medium" />
        <Logo size="large" />
      </>,
    );
    const logo = screen.queryAllByTestId('logo');
    expect(logo).toHaveLength(3);
  });

  it('accepts a textColor prop', () => {
    render(
      <>
        <Logo textColor="white" />
        <Logo textColor="black" />
      </>,
    );
    const logo = screen.queryAllByTestId('logo');
    expect(logo).toHaveLength(2);
  });
});
