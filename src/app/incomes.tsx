import { SafeAreaView, StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { Colors, Spacing, BottomTabInset } from '@/constants/theme';
import { DeckList } from '@/components/deck-list';
import { CreateDeckModal } from '@/components/create-deck-modal';
import { FloatingActionButton } from '@/components/floating-action-button';

export default function IncomesScreen() {
  const [createDeckVisible, setCreateDeckVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreateDeck = () => {
    setCreateDeckVisible(true);
  };

  const handleDeckSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>Incomes</Text>
              <Text style={styles.subtitle}>Track your income sources</Text>
            </View>
            <Pressable style={styles.addButton} onPress={handleCreateDeck}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </Pressable>
          </View>
        </View>

        {/* Deck List */}
        <View style={styles.deckListContainer}>
          <DeckList
            category="incomes"
            key={refreshKey}
            onDeckPress={(deck) => {
              // TODO: Navigate to deck detail screen
              console.log('Deck pressed:', deck.name);
            }}
          />
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleCreateDeck} />

      {/* Create Deck Modal */}
      <CreateDeckModal
        visible={createDeckVisible}
        category="incomes"
        onClose={() => setCreateDeckVisible(false)}
        onSuccess={handleDeckSuccess}
      />
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
    marginBottom: Spacing.four,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.dark.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.one,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: Colors.dark.accent,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
  },
  addButtonText: {
    color: Colors.dark.background,
    fontSize: 14,
    fontWeight: '700',
  },
  deckListContainer: {
    marginBottom: Spacing.three,
  },
});
