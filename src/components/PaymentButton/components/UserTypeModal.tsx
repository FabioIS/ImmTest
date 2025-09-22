import { Pressable, Text, View } from 'react-native';
import { USER_TYPE } from '../../../constants/constants';
import { CustomModal } from '../../Modal/Modal';
import styles from '../styles';

type UserTypeModalProps = {
  isVisible: boolean;
  closeModal: () => void;
  onPress: (item: any) => void;
};

export const UserTypeModal = ({ isVisible, closeModal, onPress }: UserTypeModalProps) => {
  return (
    <CustomModal isVisible={isVisible} onClose={closeModal}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 300, height: 300, backgroundColor: 'white', borderRadius: 10 }}>
          {USER_TYPE.map((item) => (
            <Pressable
              key={item.id}
              style={styles.userTypeButton}
              onPress={() => {
                onPress(item);
                closeModal();
              }}
            >
              <Text>{item.name}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </CustomModal>
  );
};
