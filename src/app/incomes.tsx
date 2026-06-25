import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing, BottomTabInset } from '@/constants/theme';

export default function IncomesScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Incomes</Text>
        <Text style={styles.placeholder}>Income tracking coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.dark.text,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  placeholder: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
});
