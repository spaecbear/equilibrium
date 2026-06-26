import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import { useEffect } from 'react';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { initializeDatabase } from '@/db/database';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // SQLite is only supported on native platforms
    if (Platform.OS !== 'web') {
      initializeDatabase();
    }
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AppTabs />
    </ThemeProvider>
  );
}
