import { act, renderHook } from '@testing-library/react-native';
import { useModal } from '../../src/hooks/useModal';

describe('useModal', () => {
  it('should initialize with modal closed', () => {
    const { result } = renderHook(() => useModal());

    expect(result.current.isVisible).toBe(false);
  });

  it('should open modal when openModal is called', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal();
    });

    expect(result.current.isVisible).toBe(true);
  });

  it('should close modal when closeModal is called', () => {
    const { result } = renderHook(() => useModal());

    act(() => {
      result.current.openModal();
    });
    expect(result.current.isVisible).toBe(true);

    act(() => {
      result.current.closeModal();
    });
    expect(result.current.isVisible).toBe(false);
  });
});
