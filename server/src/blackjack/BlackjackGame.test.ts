import { describe,expect,it } from 'vitest';
import { Hand } from './Hand.js';
import { BlackjackGame } from './BlackjackGame.js';
import { Deck } from './Deck.js';
import type { Card } from './Card.js';
const c=(rank:Card['rank'],suit:Card['suit']='♠'):Card=>({rank,suit});
describe('hand scoring',()=>{it('handles aces',()=>{for(const [cards,score] of [[[c('A'),c('7')],18],[[c('A'),c('9'),c('5')],15],[[c('A'),c('K')],21],[[c('A'),c('A')],12],[[c('A'),c('A'),c('9')],21],[[c('A'),c('A'),c('9'),c('5')],16]] as const){const h=new Hand();cards.forEach(x=>h.add(x));expect(h.getScore()).toBe(score);}});it('detects blackjack and bust',()=>{const h=new Hand();h.add(c('K'));h.add(c('A'));expect(h.isBlackjack()).toBe(true);h.add(c('9'));expect(h.isBust()).toBe(true);});});
describe('game state',()=>{it('starts with 10000 chips and accepts a valid bet',()=>{const g=new BlackjackGame({deck:new Deck([c('2'),c('5'),c('K'),c('9')])});g.placeBet(100);expect(g.balance).toBe(9900);expect(g.player.cards).toHaveLength(2);});it('rejects invalid bets',()=>{const g=new BlackjackGame();expect(()=>g.placeBet(0)).toThrow();expect(()=>g.placeBet(-1)).toThrow();expect(()=>g.placeBet(10001)).toThrow();});});
