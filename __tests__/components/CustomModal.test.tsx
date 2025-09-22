import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { CustomModal } from '../../src/components/Modal/Modal';

describe('CustomModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      isVisible: true,
      onClose: mockOnClose,
      children: <Text>Modal Content</Text>,
    };

    return render(<CustomModal {...defaultProps} {...props} />);
  };

  it('should render modal when visible', () => {
    const { getByText } = renderComponent();

    expect(getByText('Modal Content')).toBeTruthy();
  });

  it('should not render when not visible', () => {
    const { queryByText } = renderComponent({ isVisible: false });

    expect(queryByText('Modal Content')).toBeNull();
  });

  it('should render children correctly', () => {
    const customChildren = (
      <View>
        <Text>Title</Text>
        <Text>Description</Text>
      </View>
    );

    const { getByText } = renderComponent({ children: customChildren });

    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Description')).toBeTruthy();
  });

  it('should call onClose when modal background is pressed', () => {
    const { getByTestId } = renderComponent();

    const modalBackground = getByTestId('modal-overlay');
    fireEvent.press(modalBackground);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should have default props', () => {
    const { getByText } = render(
      <CustomModal isVisible={true} onClose={mockOnClose}>
        <Text>Default Modal</Text>
      </CustomModal>
    );

    expect(getByText('Default Modal')).toBeTruthy();
  });

  it('should handle all props together', () => {
    const customProps = {
      isVisible: true,
      onClose: mockOnClose,
      transparent: true,
      animationType: 'fade' as const,
      children: <Text>Custom Modal</Text>,
    };

    const { getByText } = renderComponent(customProps);

    expect(getByText('Custom Modal')).toBeTruthy();
  });

  it('should not call onClose when modal content is pressed', () => {
    const { getByText } = renderComponent();

    const modalContent = getByText('Modal Content');
    fireEvent.press(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
