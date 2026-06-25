import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors, Spacing, BottomTabInset } from '@/constants/theme';

interface FloatingActionButtonProps {
  onPress: () => void;
}

export function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.fab,
        { bottom: BottomTabInset + Spacing.three },
        pressed && styles.fabPressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.fabText}>+</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: Spacing.three,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.dark.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: {
    opacity: 0.9,
  },
  fabText: {
    color: Colors.dark.background,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 28,
  },
});
