import { Text, View } from 'react-native';
import styles from './styles';

export const Badge = ({ count, size, color }: { count: number; size: number; color: string }) => {
  if (count <= 0) {
    return null;
  }

  return (
    <View
      style={[
        styles.badge,
        { height: size, width: size, borderRadius: size, backgroundColor: color },
      ]}
    >
      <Text style={styles.badgeText}>{count}</Text>
    </View>
  );
};
