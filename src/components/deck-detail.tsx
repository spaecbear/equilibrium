import {
  Modal,
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  SafeAreaView,
  FlatList,
  Alert,
} from 'react-native';
import { Colors, Spacing, BottomTabInset } from '@/constants/theme';
import { Deck, Card, createCard, getCardsByDeck, deleteCard, updateCard } from '@/db/database';
import { useState, useEffect } from 'react';

interface DeckDetailProps {
  visible: boolean;
  deck: Deck | null;
  onClose: () => void;
}

export function DeckDetail({ visible, deck, onClose }: DeckDetailProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  useEffect(() => {
    if (visible && deck) {
      loadCards();
    }
  }, [visible, deck]);

  const loadCards = () => {
    if (!deck) return;
    const cardList = getCardsByDeck(deck.id);
    setCards(cardList);
  };

  const handleAddCard = async () => {
    if (!amount.trim() || !deck) {
      alert('Please enter an amount');
      return;
    }

    try {
      const numAmount = parseFloat(amount);
      if (editingCard) {
        await updateCard(editingCard.id, {
          amount: numAmount,
          date,
          note: note.trim() || null,
        });
      } else {
        await createCard(deck.id, numAmount, date, note.trim() || null);
      }
      loadCards();
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
      setEditingCard(null);
      setShowAddCard(false);
    } catch (error) {
      console.error('Error saving card:', error);
      alert('Failed to save card');
    }
  };

  const handleEditCard = (card: Card) => {
    setEditingCard(card);
    setAmount(card.amount.toString());
    setDate(card.date);
    setNote(card.note || '');
    setShowAddCard(true);
  };

  const handleDeleteCard = (cardId: string) => {
    Alert.alert('Delete Entry?', 'Are you sure you want to delete this entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCard(cardId);
            loadCards();
          } catch (error) {
            alert('Failed to delete entry');
          }
        },
      },
    ]);
  };

  const handleCancel = () => {
    setShowAddCard(false);
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
    setEditingCard(null);
  };

  const total = cards.reduce((sum, card) => sum + card.amount, 0);

  const renderCard = ({ item }: { item: Card }) => (
    <Pressable
      style={({ pressed }) => [
        styles.cardItem,
        pressed && styles.cardItemPressed,
      ]}
      onLongPress={() => handleEditCard(item)}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardAmount}>${item.amount.toFixed(2)}</Text>
          <Text style={styles.cardDate}>{item.date}</Text>
        </View>
        {item.note && <Text style={styles.cardNote}>{item.note}</Text>}
      </View>
      <Pressable
        style={styles.deleteButton}
        onPress={() => handleDeleteCard(item.id)}
      >
        <Text style={styles.deleteText}>✕</Text>
      </Pressable>
    </Pressable>
  );

  if (!deck) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onClose}>
              <Text style={styles.closeButton}>Back</Text>
            </Pressable>
            <Text style={styles.title}>{deck.name}</Text>
            <Text style={styles.placeholder} />
          </View>

          {!showAddCard ? (
            <>
              {/* Total */}
              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>

              {/* Cards List */}
              {cards.length > 0 ? (
                <FlatList
                  data={cards}
                  renderItem={renderCard}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContent}
                  scrollEnabled={true}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No entries yet</Text>
                  <Text style={styles.emptySubtext}>Tap the button below to add one</Text>
                </View>
              )}

              {/* Add Card Button */}
              <Pressable
                style={styles.addCardButton}
                onPress={() => setShowAddCard(true)}
              >
                <Text style={styles.addCardButtonText}>+ Add Entry</Text>
              </Pressable>
            </>
          ) : (
            <>
              {/* Add Card Form */}
              <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.section}>
                  <Text style={styles.label}>Amount</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor={Colors.dark.textSecondary}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Date</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={Colors.dark.textSecondary}
                    value={date}
                    onChangeText={setDate}
                  />
                </View>

                <View style={styles.section}>
                  <Text style={styles.label}>Note (optional)</Text>
                  <TextInput
                    style={[styles.input, styles.noteInput]}
                    placeholder="Add a note..."
                    placeholderTextColor={Colors.dark.textSecondary}
                    value={note}
                    onChangeText={setNote}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </ScrollView>

              {/* Form Buttons */}
              <View style={styles.formButtons}>
                <Pressable style={styles.cancelButton} onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.saveButton} onPress={handleAddCard}>
                  <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.accentDim,
  },
  closeButton: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '700',
  },
  placeholder: {
    width: 50,
  },
  totalSection: {
    alignItems: 'center',
    paddingVertical: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.accentDim,
    marginHorizontal: Spacing.three,
  },
  totalLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: Spacing.one,
  },
  totalValue: {
    color: Colors.dark.accent,
    fontSize: 32,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    gap: Spacing.two,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderLeftWidth: 3,
    borderLeftColor: Colors.dark.accent,
  },
  cardItemPressed: {
    backgroundColor: Colors.dark.accentDim,
  },
  cardContent: {
    flex: 1,
    gap: Spacing.one,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardAmount: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '700',
  },
  cardDate: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  cardNote: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: '400',
    marginTop: Spacing.one,
  },
  deleteButton: {
    padding: Spacing.two,
    marginRight: -Spacing.two,
  },
  deleteText: {
    color: Colors.dark.negative,
    fontSize: 18,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
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
  addCardButton: {
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.three,
    backgroundColor: Colors.dark.accent,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  addCardButtonText: {
    color: Colors.dark.background,
    fontSize: 16,
    fontWeight: '700',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  section: {
    marginBottom: Spacing.three,
  },
  label: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing.two,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    color: Colors.dark.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: Colors.dark.accentDim,
  },
  noteInput: {
    paddingVertical: Spacing.three,
    textAlignVertical: 'top',
  },
  formButtons: {
    flexDirection: 'row',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundElement,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.accentDim,
  },
  cancelButtonText: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.dark.accent,
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
    alignItems: 'center',
  },
  saveButtonText: {
    color: Colors.dark.background,
    fontSize: 16,
    fontWeight: '700',
  },
});
