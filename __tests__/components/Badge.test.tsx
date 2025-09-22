import { render } from '@testing-library/react-native';
import React from 'react';
import { Badge } from '../../src/components/Badge/Badge';

describe('Badge', () => {
  const defaultProps = {
    count: 5,
    size: 20,
    color: '#ff0000',
  };

  it('should render badge with count', () => {
    const { getByText } = render(<Badge {...defaultProps} />);

    expect(getByText('5')).toBeTruthy();
  });

  it('should render badge with different count', () => {
    const { getByText } = render(<Badge {...defaultProps} count={10} />);

    expect(getByText('10')).toBeTruthy();
  });

  it('should not render badge with zero count', () => {
    const { queryByText } = render(<Badge {...defaultProps} count={0} />);

    expect(queryByText('0')).toBeFalsy();
  });

  it('should render badge with large count', () => {
    const { getByText } = render(<Badge {...defaultProps} count={999} />);

    expect(getByText('999')).toBeTruthy();
  });

  it('should render badge with different size', () => {
    const { getByText } = render(<Badge {...defaultProps} size={30} />);

    expect(getByText('5')).toBeTruthy();
  });

  it('should render badge with different color', () => {
    const { getByText } = render(<Badge {...defaultProps} color="#00ff00" />);

    expect(getByText('5')).toBeTruthy();
  });

  it('should render badge with all custom props', () => {
    const customProps = {
      count: 42,
      size: 25,
      color: '#123456',
    };
    const { getByText } = render(<Badge {...customProps} />);

    expect(getByText('42')).toBeTruthy();
  });

  it('should not handle negative count', () => {
    const { queryByText } = render(<Badge {...defaultProps} count={-1} />);

    expect(queryByText('-1')).toBeFalsy();
  });
});
