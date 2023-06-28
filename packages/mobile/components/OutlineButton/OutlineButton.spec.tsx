import { render, screen } from '@testing-library/react-native';
import React from 'react';
import OutlineButton from './OutlineButton';

describe('OutlineButton', () => {
  it('renders correctly', () => {
    render(<OutlineButton />);
    const button = screen.queryAllByRole('button');
    expect(button).toHaveLength(1);
  });

  it('accepts a width prop', () => {
    render(<OutlineButton width={100} />);
    const button = screen.queryAllByRole('button');
    expect(button).toHaveLength(1);
  });

  it('accepts a fontSize prop', () => {
    render(<OutlineButton fontSize={10} />);
    const button = screen.queryAllByRole('button');
    expect(button).toHaveLength(1);
  });
});
