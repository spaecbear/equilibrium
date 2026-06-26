import { SafeAreaView, StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { useState } from 'react';
import { Colors, Spacing, BottomTabInset } from '@/constants/theme';
import { DeckList } from '@/components/deck-list';
import { CreateDeckModal } from '@/components/create-deck-modal';
import { FloatingActionButton } from '@/components/floating-action-button';

export default function AssetsScreen() {
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
          <Text style={styles.title}>Assets</Text>
          <Text style={styles.subtitle}>Track your assets over time</Text>
        </View>

        {/* Deck List */}
        <View style={styles.deckListContainer}>
          <DeckList
            category="assets"
            key={refreshKey}
            onDeckPress={(deck) => {
              // TODO: Navigate to asset history screen
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
        category="assets"
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
  deckListContainer: {
    marginBottom: Spacing.three,
  },
});
