import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CustomModal } from '../Modal/Modal';
import styles from './SeatPickerModal.styles';

interface SeatPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (seat: string, row: number) => void;
  initialSeat: string;
  initialRow: number;
}

const SEAT_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

const ROW_NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1);

const ITEM_HEIGHT = 50;

export const SeatPickerModal: React.FC<SeatPickerModalProps> = ({
  visible,
  onClose,
  onConfirm,
  initialSeat,
  initialRow,
}) => {
  const [selectedSeat, setSelectedSeat] = useState(initialSeat);
  const [selectedRow, setSelectedRow] = useState(initialRow);

  const handleConfirm = () => {
    onConfirm(selectedSeat, selectedRow);
  };

  const renderWheelPicker = (
    items: (string | number)[],
    selectedValue: string | number,
    onValueChange: (value: string | number) => void,
    label: string
  ) => {
    const selectedIndex = items.indexOf(selectedValue);

    return (
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>{label}</Text>
        <View style={styles.picker}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            snapToInterval={ITEM_HEIGHT}
            snapToAlignment="start"
            decelerationRate="fast"
            contentOffset={{ x: 0, y: selectedIndex * ITEM_HEIGHT }}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
              const value = items[index];
              if (value !== undefined) {
                onValueChange(value);
              }
            }}
          >
            <View style={{ height: ITEM_HEIGHT * 2 }} />

            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.pickerItem, item === selectedValue && styles.selectedPickerItem]}
                onPress={() => onValueChange(item)}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    item === selectedValue && styles.selectedPickerItemText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={{ height: ITEM_HEIGHT * 2 }} />
          </ScrollView>

          <View style={styles.selectionIndicator} />
        </View>
      </View>
    );
  };

  return (
    <CustomModal isVisible={visible} animationType="slide" onClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar Asiento</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pickersContainer}>
            {renderWheelPicker(
              SEAT_LETTERS,
              selectedSeat,
              (value) => setSelectedSeat(value as string),
              'Letra'
            )}

            {renderWheelPicker(
              ROW_NUMBERS,
              selectedRow,
              (value) => setSelectedRow(value as number),
              'Fila'
            )}
          </View>

          <View style={styles.previewContainer}>
            <Text style={styles.previewLabel}>Asiento seleccionado:</Text>
            <View style={styles.previewSeat}>
              <Text style={styles.previewText}>
                {selectedSeat}
                {selectedRow}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </CustomModal>
  );
};
