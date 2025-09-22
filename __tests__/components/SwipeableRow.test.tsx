import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { SwipeableRow } from '../../src/components/SwipeableRow/SwipeableRow';

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');

  return {
    Gesture: {
      Pan: () => ({
        activeOffsetX: jest.fn().mockReturnThis(),
        onUpdate: jest.fn().mockReturnThis(),
        onEnd: jest.fn().mockReturnThis(),
      }),
    },
    GestureDetector: ({ children }: any) => children,
  };
});

jest.mock('react-native-worklets', () => ({
  scheduleOnRN: (fn: Function) => fn(),
}));

describe('SwipeableRow', () => {
  const mockOnSwipeComplete = jest.fn();
  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnSwipeComplete.mockClear();
    mockOnPress.mockClear();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      onSwipeComplete: mockOnSwipeComplete,
      onPress: mockOnPress,
      children: <Text>Test Content</Text>,
    };

    return render(<SwipeableRow {...defaultProps} {...props} />);
  };

  it('should render children correctly', () => {
    const { getByText } = renderComponent();

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should render delete background', () => {
    const { getByText } = renderComponent();

    expect(getByText('Delete')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const { getByText } = renderComponent();

    const content = getByText('Test Content');
    fireEvent.press(content);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should render with custom children', () => {
    const customChildren = (
      <View>
        <Text>Custom Title</Text>
        <Text>Custom Subtitle</Text>
      </View>
    );

    const { getByText } = renderComponent({ children: customChildren });

    expect(getByText('Custom Title')).toBeTruthy();
    expect(getByText('Custom Subtitle')).toBeTruthy();
  });

  it('should handle different onSwipeComplete callbacks', () => {
    const customCallback = jest.fn();
    const { getByText } = renderComponent({ onSwipeComplete: customCallback });

    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should handle different onPress callbacks', () => {
    const customOnPress = jest.fn();
    const { getByText } = renderComponent({ onPress: customOnPress });

    const content = getByText('Test Content');
    fireEvent.press(content);

    expect(customOnPress).toHaveBeenCalledTimes(1);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should render multiple SwipeableRows independently', () => {
    const { getAllByText } = render(
      <View>
        <SwipeableRow onSwipeComplete={mockOnSwipeComplete} onPress={mockOnPress}>
          <Text>Row 1</Text>
        </SwipeableRow>
        <SwipeableRow onSwipeComplete={mockOnSwipeComplete} onPress={mockOnPress}>
          <Text>Row 2</Text>
        </SwipeableRow>
      </View>
    );

    expect(getAllByText('Delete')).toHaveLength(2);
    expect(getAllByText(/Row \d/)).toHaveLength(2);
  });
});
