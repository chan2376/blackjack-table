export type Suit = '♠' | '♥' | '♦' | '♣';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';
export interface Card { suit: Suit; rank: Rank; }
export const SUITS: Suit[] = ['♠','♥','♦','♣'];
export const RANKS: Rank[] = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
export const cardValue = (card: Card) => card.rank === 'A' ? 11 : ['J','Q','K'].includes(card.rank) ? 10 : Number(card.rank);
