import { View, StyleSheet, FlatList, Pressable, Text, Alert, Platform } from 'react-native';
import { Colors, Spacing } from '@/constants/theme';
import { Deck, deleteDeck, getDecksByCategory, Category } from '@/db/database';
import { useEffect, useState } from 'react';

interface DeckListProps {
  category: Category;
  onDeckPress?: (deck: Deck) => void;
  onRefresh?: () => void;
}

export function DeckList({ category, onDeckPress, onRefresh }: DeckListProps) {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDecks();
  }, [category, onRefresh]);

  const loadDecks = () => {
    setLoading(true);
    setError(null);
    try {
      const deckList = getDecksByCategory(category);
      setDecks(deckList);
    } catch (err) {
      console.error('Failed to load decks:', err);
      setError('Failed to load decks');
      setDecks([]);
    }
    setLoading(false);
  };

  const handleDelete = (deckId: string, deckName: string) => {
    Alert.alert('Delete Deck?', `Are you sure you want to delete "${deckName}"? This will also delete all entries in this deck.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDeck(deckId);
            loadDecks();
          } catch (error) {
            console.error('Failed to delete deck:', error);
            alert('Failed to delete deck');
          }
        },
      },
    ]);
  };

  const renderDeck = ({ item }: { item: Deck }) => (
    <Pressable
      style={({ pressed }) => [
        styles.deckCard,
        { borderLeftColor: item.color },
        pressed && styles.deckCardPressed,
      ]}
      onPress={() => onDeckPress?.(item)}
    >
      <View style={styles.deckContent}>
        <View style={styles.deckHeader}>
          <View style={[styles.deckIcon, { backgroundColor: item.color }]} />
          <Text style={styles.deckName}>{item.name}</Text>
        </View>
        <Text style={styles.deckCategory}>{item.category}</Text>
      </View>
      <Pressable
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id, item.name)}
      >
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Error loading decks</Text>
        <Text style={styles.emptySubtext}>{error}</Text>
      </View>
    );
  }

  if (decks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No decks yet</Text>
        <Text style={styles.emptySubtext}>Create one to get started</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={decks}
      renderItem={renderDeck}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: Spacing.three,
  },
  deckCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    borderLeftWidth: 6,
    minHeight: 80,
  },
  deckCardPressed: {
    backgroundColor: Colors.dark.accentDim,
  },
  deckContent: {
    flex: 1,
    gap: Spacing.one,
  },
  deckHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  deckIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  deckName: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: '700',
  },
  deckCategory: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 48,
  },
  deleteButton: {
    padding: Spacing.three,
    marginRight: -Spacing.three,
  },
  deleteText: {
    color: Colors.dark.negative,
    fontSize: 24,
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.one,
  },
  emptySubtext: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },
});
