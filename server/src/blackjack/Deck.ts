import { randomInt } from 'node:crypto';
import { Card, RANKS, SUITS } from './Card.js';

export class Deck {
  private cards: Card[];
  constructor(cards?: Card[]) { this.cards = cards ? [...cards] : Deck.createDeck(); if (!cards) this.shuffle(); }
  static createDeck(): Card[] { return SUITS.flatMap(suit => RANKS.map(rank => ({ suit, rank }))); }
  shuffle(): void { for (let i=this.cards.length-1;i>0;i--){ const j=randomInt(i+1); [this.cards[i],this.cards[j]]=[this.cards[j],this.cards[i]]; } }
  draw(): Card { const card=this.cards.pop(); if(!card) throw new Error('Deck is empty'); return card; }
  remainingCards(): number { return this.cards.length; }
  reset(): void { this.cards=Deck.createDeck(); this.shuffle(); }
}
