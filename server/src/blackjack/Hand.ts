import { Card, cardValue } from './Card.js';
export type HandStatus='playing'|'stand'|'bust'|'blackjack'|'win'|'lose'|'push';
export class Hand {
  cards: Card[]=[];
  status: HandStatus='playing';
  add(card:Card){this.cards.push(card);}
  getScore():number { let total=this.cards.reduce((s,c)=>s+cardValue(c),0); let aces=this.cards.filter(c=>c.rank==='A').length; while(total>21&&aces>0){total-=10;aces--;} return total; }
  isSoft():boolean { let total=this.cards.reduce((s,c)=>s+cardValue(c),0); let aces=this.cards.filter(c=>c.rank==='A').length; while(total>21&&aces>0){total-=10;aces--;} return aces>0; }
  isBlackjack():boolean{return this.cards.length===2&&this.getScore()===21;}
  isBust():boolean{return this.getScore()>21;}
}
