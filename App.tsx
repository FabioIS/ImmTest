import React, { useEffect } from 'react';
import { Platform, StatusBar, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Edges, SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { Navigation } from './src/navigation/navigation';
import { fetchProductsThunk, store, useAppDispatch } from './src/redux';

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProductsThunk());
  }, [dispatch]);

  return <>{children}</>;
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const iOSEdges: Edges = ['right', 'left', 'top', 'bottom'];
  const androidEdges: Edges = ['right', 'left', 'bottom'];
  const isAndroid = Platform.OS === 'android';
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }} edges={isAndroid ? androidEdges : iOSEdges}>
            <AppInitializer>
              <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
              <Navigation />
            </AppInitializer>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}

export default App;
