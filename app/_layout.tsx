import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { pl, registerTranslation } from 'react-native-paper-dates';

import { useColorScheme } from '@/hooks/use-color-scheme';

registerTranslation('pl', pl);

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="car/[id]" options={{ title: 'Szczegóły auta' }} />
          <Stack.Screen name="reserve/[id]" options={{ title: 'Nowa rezerwacja' }} />
          <Stack.Screen name="reservation/[id]" options={{ title: 'Szczegóły rezerwacji' }} />
          <Stack.Screen name="edit-profile" options={{ title: 'Edytuj profil' }} />
          <Stack.Screen name="camera" options={{ title: 'Zrób zdjęcie', headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}
