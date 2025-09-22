import { Dimensions, Pressable, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import styles from './SwipeableRow.styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = -SCREEN_WIDTH * 0.3;

interface SwipeableRowProps {
  onSwipeComplete: () => void;
  children: React.ReactNode;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const SwipeableRow: React.FC<SwipeableRowProps> = ({
  onSwipeComplete,
  children,
  onPress,
}) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const handleSwipeComplete = () => {
    'worklet';
    scheduleOnRN(onSwipeComplete);
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, Number.MAX_VALUE])
    .onUpdate((event) => {
      if (event.translationX <= 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX < SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, () => {
          handleSwipeComplete();
        });
      } else {
        translateX.value = withTiming(0, {
          duration: 300,
        });
      }
    });

  const animatedRowStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    const backgroundOpacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 1],
      Extrapolation.CLAMP
    );

    const scale = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0.8, 1],
      Extrapolation.CLAMP
    );

    return {
      opacity: backgroundOpacity,
      transform: [{ scale }],
    };
  });

  return (
    <View style={styles.swipeContainer}>
      <Animated.View style={[styles.deleteBackground, animatedBackgroundStyle]}>
        <Text style={styles.deleteText}>Delete</Text>
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <AnimatedPressable style={[styles.productRow, animatedRowStyle]} onPress={onPress}>
          {children}
        </AnimatedPressable>
      </GestureDetector>
    </View>
  );
};
