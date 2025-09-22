import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-worklets', () => ({
  scheduleOnRN: jest.fn((callback) => callback()),
}));

jest.mock('react-native-reanimated', () => {
  const mockAnimated = {
    createAnimatedComponent: jest.fn((component) => component),
    View: require('react-native').View,
  };

  return {
    __esModule: true,
    default: mockAnimated,
    useSharedValue: jest.fn((initialValue) => ({ value: initialValue })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((value, config, callback) => {
      if (callback) callback();
      return value;
    }),
    useEvent: jest.fn(() => jest.fn()),
    Extrapolation: {
      CLAMP: 'clamp',
      EXTEND: 'extend',
      IDENTITY: 'identity',
    },
    interpolate: jest.fn(() => 0),
  };
});
