import { Modal, Pressable } from 'react-native';
import styles from './styles';

type ModalProps = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  transparent?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
};

export const CustomModal = ({
  isVisible,
  onClose,
  children,
  transparent = true,
  animationType = 'fade',
}: ModalProps) => {
  return (
    <Modal
      animationType={animationType}
      transparent={transparent}
      visible={isVisible}
      onRequestClose={onClose}
    >
      {animationType === 'fade' && (
        <Pressable style={styles.overlay} onPress={onClose} testID="modal-overlay" />
      )}
      {children}
    </Modal>
  );
};
