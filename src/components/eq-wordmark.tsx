import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

interface EQWordmarkProps {
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export function EQWordmark({ size = 'medium', showLabel = false }: EQWordmarkProps) {
  const sizeConfig = {
    small: { fontSize: 14, height: 28, width: 28 },
    medium: { fontSize: 18, height: 36, width: 36 },
    large: { fontSize: 24, height: 48, width: 48 },
  };

  const config = sizeConfig[size];

  return (
    <View style={styles.container}>
      <View style={[styles.wordmark, { height: config.height, width: config.width }]}>
        <Text
          style={[
            styles.text,
            {
              fontSize: config.fontSize,
              lineHeight: config.fontSize,
              color: Colors.dark.accent,
            },
          ]}
        >
          EQ
        </Text>
        {/* Subtle balance bar beneath */}
        <View
          style={[
            styles.balanceBar,
            {
              height: Math.max(1, config.fontSize * 0.08),
              width: config.fontSize * 0.9,
            },
          ]}
        />
      </View>
      {showLabel && <Text style={styles.label}>Equilibrium</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  wordmark: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  text: {
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  balanceBar: {
    backgroundColor: Colors.dark.accent,
    marginTop: 2,
    borderRadius: 1,
  },
  label: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
