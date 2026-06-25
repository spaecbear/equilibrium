import * as SQLite from 'expo-sqlite';
import { DeckColor, DeckIcon } from '@/constants/theme';

const db = SQLite.openDatabaseSync('equilibrium.db');

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

// Initialize the database schema
export async function initializeDatabase() {
  try {
    // Create decks table
    db.execSync(`
      CREATE TABLE IF NOT EXISTS decks (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('assets', 'expenditures', 'incomes')),
        color TEXT NOT NULL,
        icon TEXT NOT NULL,
        createdAt TEXT NOT NULL
      );
    `);

    // Create cards table
    db.execSync(`
      CREATE TABLE IF NOT EXISTS cards (
        id TEXT PRIMARY KEY,
        deckId TEXT NOT NULL,
        amount REAL NOT NULL,
        date TEXT NOT NULL,
        note TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY(deckId) REFERENCES decks(id) ON DELETE CASCADE
      );
    `);

    // Create indexes for performance
    db.execSync(`
      CREATE INDEX IF NOT EXISTS idx_cards_deckId ON cards(deckId);
      CREATE INDEX IF NOT EXISTS idx_cards_date ON cards(date);
      CREATE INDEX IF NOT EXISTS idx_decks_category ON decks(category);
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
}

// Deck operations
export function createDeck(name: string, category: Category, color: DeckColor, icon: DeckIcon): Deck {
  const id = `deck_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date().toISOString();

  const stmt = db.prepareSync(`
    INSERT INTO decks (id, name, category, color, icon, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.executeSync([id, name, category, color, icon, createdAt]);

  return { id, name, category, color, icon, createdAt };
}

export function getDecksByCategory(category: Category): Deck[] {
  const stmt = db.prepareSync(`
    SELECT * FROM decks WHERE category = ? ORDER BY createdAt DESC
  `);

  const result = stmt.allSync(category) as Deck[];
  return result;
}

export function getDeckById(id: string): Deck | null {
  const stmt = db.prepareSync(`SELECT * FROM decks WHERE id = ?`);
  const result = stmt.allSync(id) as Deck[];
  return result.length > 0 ? result[0] : null;
}

export function updateDeck(id: string, updates: Partial<Omit<Deck, 'id' | 'createdAt'>>): void {
  const currentDeck = getDeckById(id);
  if (!currentDeck) throw new Error(`Deck ${id} not found`);

  const name = updates.name ?? currentDeck.name;
  const color = updates.color ?? currentDeck.color;
  const icon = updates.icon ?? currentDeck.icon;

  const stmt = db.prepareSync(`
    UPDATE decks SET name = ?, color = ?, icon = ? WHERE id = ?
  `);

  stmt.executeSync([name, color, icon, id]);
}

export function deleteDeck(id: string): void {
  const stmt = db.prepareSync(`DELETE FROM decks WHERE id = ?`);
  stmt.executeSync(id);
}

// Card operations
export function createCard(
  deckId: string,
  amount: number,
  date: string,
  note: string | null = null
): Card {
  const id = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const stmt = db.prepareSync(`
    INSERT INTO cards (id, deckId, amount, date, note, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.executeSync([id, deckId, amount, date, note, createdAt, updatedAt]);

  return { id, deckId, amount, date, note, createdAt, updatedAt };
}

export function getCardsByDeckAndMonth(deckId: string, year: number, month: number): Card[] {
  const monthStr = String(month).padStart(2, '0');
  const yearStr = String(year);
  const datePattern = `${yearStr}-${monthStr}%`;

  const stmt = db.prepareSync(`
    SELECT * FROM cards
    WHERE deckId = ? AND date LIKE ?
    ORDER BY date DESC
  `);

  const result = stmt.allSync(deckId, datePattern) as Card[];
  return result;
}

export function getCardsByDeck(deckId: string): Card[] {
  const stmt = db.prepareSync(`
    SELECT * FROM cards WHERE deckId = ? ORDER BY date DESC
  `);

  const result = stmt.allSync(deckId) as Card[];
  return result;
}

export function getCardsByCategory(category: Category, year: number, month: number): Card[] {
  const monthStr = String(month).padStart(2, '0');
  const yearStr = String(year);
  const datePattern = `${yearStr}-${monthStr}%`;

  const stmt = db.prepareSync(`
    SELECT c.* FROM cards c
    INNER JOIN decks d ON c.deckId = d.id
    WHERE d.category = ? AND c.date LIKE ?
    ORDER BY c.date DESC
  `);

  const result = stmt.allSync(category, datePattern) as Card[];
  return result;
}

export function updateCard(id: string, updates: Partial<Omit<Card, 'id' | 'deckId' | 'createdAt'>>): void {
  const stmt = db.prepareSync(`
    SELECT * FROM cards WHERE id = ?
  `);
  const currentCards = stmt.allSync(id) as Card[];
  if (currentCards.length === 0) throw new Error(`Card ${id} not found`);

  const currentCard = currentCards[0];
  const amount = updates.amount ?? currentCard.amount;
  const date = updates.date ?? currentCard.date;
  const note = updates.note ?? currentCard.note;
  const updatedAt = new Date().toISOString();

  const updateStmt = db.prepareSync(`
    UPDATE cards SET amount = ?, date = ?, note = ?, updatedAt = ? WHERE id = ?
  `);

  updateStmt.executeSync([amount, date, note, updatedAt, id]);
}

export function deleteCard(id: string): void {
  const stmt = db.prepareSync(`DELETE FROM cards WHERE id = ?`);
  stmt.executeSync(id);
}

// Aggregation queries
export function getDeckTotal(deckId: string): number {
  const stmt = db.prepareSync(`
    SELECT SUM(amount) as total FROM cards WHERE deckId = ?
  `);

  const result = stmt.allSync(deckId) as Array<{ total: number | null }>;
  return result[0]?.total ?? 0;
}

export function getDeckTotalForMonth(deckId: string, year: number, month: number): number {
  const monthStr = String(month).padStart(2, '0');
  const yearStr = String(year);
  const datePattern = `${yearStr}-${monthStr}%`;

  const stmt = db.prepareSync(`
    SELECT SUM(amount) as total FROM cards WHERE deckId = ? AND date LIKE ?
  `);

  const result = stmt.allSync(deckId, datePattern) as Array<{ total: number | null }>;
  return result[0]?.total ?? 0;
}

export function getCategoryTotal(category: Category): number {
  const stmt = db.prepareSync(`
    SELECT SUM(c.amount) as total FROM cards c
    INNER JOIN decks d ON c.deckId = d.id
    WHERE d.category = ?
  `);

  const result = stmt.allSync(category) as Array<{ total: number | null }>;
  return result[0]?.total ?? 0;
}

export function getCategoryTotalForMonth(category: Category, year: number, month: number): number {
  const monthStr = String(month).padStart(2, '0');
  const yearStr = String(year);
  const datePattern = `${yearStr}-${monthStr}%`;

  const stmt = db.prepareSync(`
    SELECT SUM(c.amount) as total FROM cards c
    INNER JOIN decks d ON c.deckId = d.id
    WHERE d.category = ? AND c.date LIKE ?
  `);

  const result = stmt.allSync(category, datePattern) as Array<{ total: number | null }>;
  return result[0]?.total ?? 0;
}

// For asset history – get the latest value as of a date
export function getAssetLatestValue(deckId: string, asOfDate?: string): number {
  const dateFilter = asOfDate ? `date <= ?` : '1=1';
  const params = asOfDate ? [deckId, asOfDate] : [deckId];

  const stmt = db.prepareSync(`
    SELECT amount FROM cards
    WHERE deckId = ? AND ${dateFilter}
    ORDER BY date DESC
    LIMIT 1
  `);

  const result = stmt.allSync(...params) as Array<{ amount: number }>;
  return result[0]?.amount ?? 0;
}
