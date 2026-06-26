import {
  Modal,
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { Colors, DeckColorPresets, Spacing } from '@/constants/theme';
import { createDeck, updateDeck, Deck, Category } from '@/db/database';
import { useState, useEffect } from 'react';

interface CreateDeckModalProps {
  visible: boolean;
  category: Category;
  deck?: Deck;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateDeckModal({ visible, category, deck, onClose, onSuccess }: CreateDeckModalProps) {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState<string>(DeckColorPresets[0].hex);

  useEffect(() => {
    if (deck) {
      setName(deck.name);
      setSelectedColor(deck.color);
    } else {
      setName('');
      setSelectedColor(DeckColorPresets[0].hex);
    }
  }, [deck, visible]);

  const handleSave = () => {
    if (!name.trim()) {
      alert('Please enter a deck name');
      return;
    }

    if (Platform.OS === 'web') {
      Alert.alert('Web Preview', 'Database persistence works on iOS/Android. Test the full app there!');
      onClose();
      return;
    }

    try {
      if (deck) {
        updateDeck(deck.id, { name, color: selectedColor as any });
      } else {
        createDeck(name, category, selectedColor as any, 'wallet');
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert('Failed to save deck');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onClose}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </Pressable>
            <Text style={styles.title}>{deck ? 'Edit Deck' : 'New Deck'}</Text>
            <Pressable onPress={handleSave}>
              <Text style={styles.saveButton}>Save</Text>
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Name Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Deck Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., DoorDash, Robinhood, Paycheck"
                placeholderTextColor={Colors.dark.textSecondary}
                value={name}
                onChangeText={setName}
                maxLength={30}
              />
              <Text style={styles.characterCount}>{name.length}/30</Text>
            </View>

            {/* Color Selector */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Color</Text>
              <View style={styles.colorGrid}>
                {DeckColorPresets.map((preset) => (
                  <Pressable
                    key={preset.hex}
                    style={[
                      styles.colorOption,
                      { backgroundColor: preset.hex },
                      selectedColor === preset.hex && styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(preset.hex)}
                  >
                    {selectedColor === preset.hex && (
                      <Text style={styles.colorCheckmark}>✓</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Category Display */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>Category</Text>
              <View style={styles.categoryDisplay}>
                <Text style={styles.categoryText}>{category}</Text>
              </View>
            </View>
          </ScrollView>
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
  cancelButton: {
    color: Colors.dark.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: Colors.dark.text,
    fontSize: 16,
    fontWeight: '700',
  },
  saveButton: {
    color: Colors.dark.accent,
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.three,
  },
  section: {
    marginTop: Spacing.four,
    marginBottom: Spacing.three,
  },
  sectionLabel: {
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
    fontSize: 14,
    borderWidth: 1,
    borderColor: Colors.dark.accentDim,
  },
  characterCount: {
    color: Colors.dark.textSecondary,
    fontSize: 11,
    marginTop: Spacing.one,
    textAlign: 'right',
  },
  colorGrid: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  colorOption: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: Colors.dark.text,
  },
  colorCheckmark: {
    color: Colors.dark.text,
    fontSize: 20,
    fontWeight: '700',
  },
  categoryDisplay: {
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderColor: Colors.dark.accentDim,
  },
  categoryText: {
    color: Colors.dark.text,
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
