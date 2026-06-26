import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeckColor, DeckIcon } from '@/constants/theme';

export type Category = 'assets' | 'expenditures' | 'incomes';

export interface Deck {
  id: string;
  name: string;
  category: Category;
  color: DeckColor;
  icon: DeckIcon;
  createdAt: string;
}

export interface Card {
  id: string;
  deckId: string;
  amount: number;
  date: string; // ISO date string
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

// Storage keys
const DECKS_KEY = '@equilibrium:decks';
const CARDS_KEY = '@equilibrium:cards';

// In-memory cache for performance
let decksCache: Deck[] = [];
let cardsCache: Card[] = [];
let isInitialized = false;

// Initialize storage
export async function initializeDatabase() {
  if (isInitialized) return;

  try {
    // Load existing data or start fresh
    const [decksData, cardsData] = await Promise.all([
      AsyncStorage.getItem(DECKS_KEY),
      AsyncStorage.getItem(CARDS_KEY),
    ]);

    decksCache = decksData ? JSON.parse(decksData) : [];
    cardsCache = cardsData ? JSON.parse(cardsData) : [];
    isInitialized = true;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Helper to persist decks
async function persistDecks() {
  try {
    await AsyncStorage.setItem(DECKS_KEY, JSON.stringify(decksCache));
  } catch (error) {
    console.error('Failed to persist decks:', error);
  }
}

// Helper to persist cards
async function persistCards() {
  try {
    await AsyncStorage.setItem(CARDS_KEY, JSON.stringify(cardsCache));
  } catch (error) {
    console.error('Failed to persist cards:', error);
  }
}

// Deck operations
export async function createDeck(name: string, category: Category, color: DeckColor, icon: DeckIcon): Promise<Deck> {
  const id = `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date().toISOString();

  const deck: Deck = { id, name, category, color, icon, createdAt };
  decksCache.push(deck);
  await persistDecks();

  return deck;
}

export function getDecksByCategory(category: Category): Deck[] {
  return decksCache
    .filter((d) => d.category === category)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getDeckById(id: string): Deck | null {
  return decksCache.find((d) => d.id === id) ?? null;
}

export async function updateDeck(id: string, updates: Partial<Omit<Deck, 'id' | 'createdAt'>>): Promise<void> {
  const deckIndex = decksCache.findIndex((d) => d.id === id);
  if (deckIndex === -1) throw new Error(`Deck ${id} not found`);

  const currentDeck = decksCache[deckIndex];
  decksCache[deckIndex] = {
    ...currentDeck,
    name: updates.name ?? currentDeck.name,
    color: updates.color ?? currentDeck.color,
    icon: updates.icon ?? currentDeck.icon,
  };

  await persistDecks();
}

export async function deleteDeck(id: string): Promise<void> {
  decksCache = decksCache.filter((d) => d.id !== id);
  cardsCache = cardsCache.filter((c) => c.deckId !== id);

  await Promise.all([persistDecks(), persistCards()]);
}

// Card operations
export async function createCard(
  deckId: string,
  amount: number,
  date: string,
  note: string | null = null
): Promise<Card> {
  const id = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const card: Card = { id, deckId, amount, date, note, createdAt, updatedAt };
  cardsCache.push(card);
  await persistCards();

  return card;
}

export function getCardsByDeckAndMonth(deckId: string, year: number, month: number): Card[] {
  const monthStr = String(month).padStart(2, '0');
  const yearStr = String(year);
  const datePrefix = `${yearStr}-${monthStr}`;

  return cardsCache
    .filter((c) => c.deckId === deckId && c.date.startsWith(datePrefix))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCardsByDeck(deckId: string): Card[] {
  return cardsCache
    .filter((c) => c.deckId === deckId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getCardsByCategory(category: Category, year: number, month: number): Card[] {
  const monthStr = String(month).padStart(2, '0');
  const yearStr = String(year);
  const datePrefix = `${yearStr}-${monthStr}`;

  const deckIds = new Set(decksCache.filter((d) => d.category === category).map((d) => d.id));

  return cardsCache
    .filter((c) => deckIds.has(c.deckId) && c.date.startsWith(datePrefix))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function updateCard(id: string, updates: Partial<Omit<Card, 'id' | 'deckId' | 'createdAt'>>): Promise<void> {
  const cardIndex = cardsCache.findIndex((c) => c.id === id);
  if (cardIndex === -1) throw new Error(`Card ${id} not found`);

  const currentCard = cardsCache[cardIndex];
  cardsCache[cardIndex] = {
    ...currentCard,
    amount: updates.amount ?? currentCard.amount,
    date: updates.date ?? currentCard.date,
    note: updates.note ?? currentCard.note,
    updatedAt: new Date().toISOString(),
  };

  await persistCards();
}

export async function deleteCard(id: string): Promise<void> {
  cardsCache = cardsCache.filter((c) => c.id !== id);
  await persistCards();
}

// Aggregation queries
export function getDeckTotal(deckId: string): number {
  return cardsCache
    .filter((c) => c.deckId === deckId)
    .reduce((sum, card) => sum + card.amount, 0);
}

export function getDeckTotalForMonth(deckId: string, year: number, month: number): number {
  const monthStr = String(month).padStart(2, '0');
  const yearStr = String(year);
  const datePrefix = `${yearStr}-${monthStr}`;

  return cardsCache
    .filter((c) => c.deckId === deckId && c.date.startsWith(datePrefix))
    .reduce((sum, card) => sum + card.amount, 0);
}

export function getCategoryTotal(category: Category): number {
  const deckIds = new Set(decksCache.filter((d) => d.category === category).map((d) => d.id));

  return cardsCache
    .filter((c) => deckIds.has(c.deckId))
    .reduce((sum, card) => sum + card.amount, 0);
}

export function getCategoryTotalForMonth(category: Category, year: number, month: number): number {
  const monthStr = String(month).padStart(2, '0');
  const yearStr = String(year);
  const datePrefix = `${yearStr}-${monthStr}`;

  const deckIds = new Set(decksCache.filter((d) => d.category === category).map((d) => d.id));

  return cardsCache
    .filter((c) => deckIds.has(c.deckId) && c.date.startsWith(datePrefix))
    .reduce((sum, card) => sum + card.amount, 0);
}

// Get the latest asset value as of a date
export function getAssetLatestValue(deckId: string, asOfDate?: string): number {
  const cards = cardsCache
    .filter((c) => c.deckId === deckId && (!asOfDate || c.date <= asOfDate))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return cards[0]?.amount ?? 0;
}
