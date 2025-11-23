import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

import { useColorScheme } from '@/hooks/use-color-scheme';

function RootStack() {
  const { theme } = useTheme();
  const colorScheme = useColorScheme();

  return (
    <>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true, title: 'Modal' }} />
        </Stack>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      </NavigationThemeProvider>
    </>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <RootStack />
      </ThemeProvider>
    </Provider>
  );
}
