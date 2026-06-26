import { useState, useEffect, useFocusEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BottomTabInset } from '@/constants/theme';
import { EQWordmark } from '@/components/eq-wordmark';
import { getCategoryTotal } from '@/db/database';

export default function OverviewScreen() {
  const [assetsTotal, setAssetsTotal] = useState(0);
  const [incomesTotal, setIncomesTotal] = useState(0);
  const [expendituresTotal, setExpendituresTotal] = useState(0);
  const [formula, setFormula] = useState<'assets' | 'net' | 'cashflow'>('net');
  const router = useRouter();

  useFocusEffect(() => {
    loadTotals();
  });

  const loadTotals = () => {
    const assets = getCategoryTotal('assets');
    const incomes = getCategoryTotal('incomes');
    const expenditures = getCategoryTotal('expenditures');

    setAssetsTotal(assets);
    setIncomesTotal(incomes);
    setExpendituresTotal(expenditures);
  };

  const calculateTotal = (): number => {
    switch (formula) {
      case 'assets':
        return assetsTotal;
      case 'net':
        return assetsTotal + incomesTotal - expendituresTotal;
      case 'cashflow':
        return incomesTotal - expendituresTotal;
      default:
        return 0;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header with EQ wordmark */}
        <View style={styles.header}>
          <EQWordmark size="medium" />
          <Text style={styles.headerTitle}>Equilibrium</Text>
        </View>

        {/* Main total display */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Balance</Text>
          <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
          <Pressable onPress={() => {
            const formulas: Array<'assets' | 'net' | 'cashflow'> = ['assets', 'net', 'cashflow'];
            const currentIndex = formulas.indexOf(formula);
            setFormula(formulas[(currentIndex + 1) % formulas.length]);
          }}>
            <Text style={styles.formulaHint}>{formula === 'assets' ? 'Assets Only' : formula === 'net' ? 'Assets + Income - Spent' : 'Income - Spent'}</Text>
          </Pressable>
        </View>

        {/* Summary cards */}
        <View style={styles.summaryContainer}>
          <Pressable
            style={[styles.summaryCard, styles.assetsCard]}
            onPress={() => router.push('/assets')}
          >
            <Text style={styles.summaryLabel}>Assets</Text>
            <Text style={styles.summaryValue}>${assetsTotal.toFixed(2)}</Text>
          </Pressable>
          <Pressable
            style={[styles.summaryCard, styles.incomeCard]}
            onPress={() => router.push('/incomes')}
          >
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={styles.summaryValue}>${incomesTotal.toFixed(2)}</Text>
          </Pressable>
          <Pressable
            style={[styles.summaryCard, styles.expenseCard]}
            onPress={() => router.push('/expenditures')}
          >
            <Text style={styles.summaryLabel}>Spent</Text>
            <Text style={styles.summaryValue}>${expendituresTotal.toFixed(2)}</Text>
          </Pressable>
        </View>

        {/* Navigation buttons */}
        <View style={styles.navContainer}>
          <Pressable style={styles.navButton} onPress={() => router.push('/assets')}>
            <Text style={styles.navButtonText}>Assets</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={() => router.push('/expenditures')}>
            <Text style={styles.navButtonText}>Spent</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={() => router.push('/incomes')}>
            <Text style={styles.navButtonText}>Income</Text>
          </Pressable>
          <Pressable style={styles.navButton} onPress={() => router.push('/charts')}>
            <Text style={styles.navButtonText}>Charts</Text>
          </Pressable>
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />
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
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  headerTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 1,
  },
  totalSection: {
    alignItems: 'center',
    marginBottom: Spacing.four,
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.accentDim,
  },
  totalLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginBottom: Spacing.one,
  },
  totalValue: {
    color: Colors.dark.accent,
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 52,
  },
  formulaHint: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    marginTop: Spacing.two,
  },
  summaryContainer: {
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },
  summaryCard: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    borderLeftWidth: 3,
  },
  assetsCard: {
    backgroundColor: Colors.dark.backgroundElement,
    borderLeftColor: Colors.dark.accent,
  },
  incomeCard: {
    backgroundColor: Colors.dark.backgroundElement,
    borderLeftColor: Colors.dark.positive,
  },
  expenseCard: {
    backgroundColor: Colors.dark.backgroundElement,
    borderLeftColor: Colors.dark.negative,
  },
  summaryLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    marginBottom: Spacing.half,
  },
  summaryValue: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '700',
  },
  navContainer: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  navButton: {
    flex: 1,
    minWidth: 70,
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  navButtonText: {
    color: Colors.dark.background,
    fontSize: 14,
    fontWeight: '700',
  },
});
