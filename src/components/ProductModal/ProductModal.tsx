import { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import {
  addProduct,
  deleteProduct,
  reduceAmount,
  selectProductById,
  useAppDispatch,
  useAppSelector,
} from '../../redux';
import { selectCartCurrency } from '../../redux/cart/selectors';
import { Currency } from '../../types/GeneralTypes';
import { Product } from '../../types/ProductTypes';
import { convertCurrency, getPriceWithCurrency } from '../../utils';
import { CustomModal } from '../Modal/Modal';
import styles from './styles';

export const ProductModal = ({
  visible,
  product,
  onClose,
}: {
  visible: boolean;
  product: Product;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const productInStore = useAppSelector((state) => selectProductById(state, product.id));
  const currentCurrency = useAppSelector(selectCartCurrency);
  const [selectedQuantity, setSelectedQuantity] = useState(product?.amount || 1);
  const maxQuantity = productInStore?.amount || 0;

  const handleQuantityChange = (change: number) => {
    const newQuantity = selectedQuantity + change;
    if (newQuantity >= 0 && newQuantity <= maxQuantity) {
      setSelectedQuantity(newQuantity);
    }
  };

  const handleSubmit = () => {
    const quantityDifference = selectedQuantity - product.amount;

    if (quantityDifference > 0) {
      dispatch(addProduct({ product, amount: quantityDifference }));
    } else if (quantityDifference < 0) {
      const toRemove = Math.abs(quantityDifference);
      dispatch(reduceAmount({ productId: product.id, amount: toRemove }));
    }

    if (selectedQuantity === 0) {
      dispatch(deleteProduct(product.id));
    }

    onClose();
  };

  return (
    <CustomModal isVisible={visible} animationType="slide" onClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Modificar Cantidad</Text>
          </View>

          <View style={styles.productInfo}>
            <Image source={require('../../../assets/image.png')} style={styles.modalProductImage} />
            <View style={styles.productDetails}>
              <Text style={styles.modalProductName}>{product.name}</Text>
              <Text style={styles.modalProductPrice}>
                {getPriceWithCurrency(
                  convertCurrency(product.price, Currency.USD, currentCurrency),
                  currentCurrency
                )}
              </Text>
              <Text style={styles.availableStock}>Disponible: {maxQuantity} unidades</Text>
            </View>
          </View>

          <View style={styles.quantitySelector}>
            <Text style={styles.quantityLabel}>Cantidad</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(-1)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{selectedQuantity}</Text>
              </View>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleQuantityChange(1)}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>
              {getPriceWithCurrency(
                convertCurrency(product.price * selectedQuantity, Currency.USD, currentCurrency),
                currentCurrency
              )}
            </Text>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelModalButton} onPress={onClose}>
              <Text style={styles.cancelModalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitModalButton} onPress={handleSubmit}>
              <Text style={styles.submitModalButtonText}>
                {selectedQuantity === 0 ? 'Eliminar' : 'Actualizar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </CustomModal>
  );
};
