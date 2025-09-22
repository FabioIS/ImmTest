import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useModal } from '../../hooks/useModal';
import { SeatPickerModal } from './SeatPickerModal';
import styles from './SeatSelector.styles';

interface SeatSelectorProps {
  selectedSeat?: string;
  selectedRow?: number;
  onSeatChange?: (seat: string, row: number) => void;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({
  selectedSeat = 'A',
  selectedRow = 1,
  onSeatChange,
}) => {
  const { isVisible, openModal, closeModal } = useModal();

  const handleSeatSelection = (seat: string, row: number) => {
    onSeatChange?.(seat, row);
    closeModal();
  };

  const handlePress = () => {
    openModal();
  };

  return (
    <>
      <TouchableOpacity style={styles.seatContainer} onPress={handlePress}>
        <View style={styles.seatDisplay}>
          <View style={styles.rowDisplay}>
            <Text style={styles.text}>{selectedSeat}</Text>
          </View>
          <View style={styles.rowDisplay}>
            <Text style={styles.text}>{selectedRow}</Text>
          </View>
        </View>
        <Text style={styles.label}>Asiento</Text>
      </TouchableOpacity>

      <SeatPickerModal
        visible={isVisible}
        onClose={closeModal}
        onConfirm={handleSeatSelection}
        initialSeat={selectedSeat}
        initialRow={selectedRow}
      />
    </>
  );
};
