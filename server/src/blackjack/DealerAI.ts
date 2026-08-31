import { Deck } from './Deck.js';
import { Hand } from './Hand.js';
export function playDealer(hand:Hand, deck:Deck):void { while(hand.getScore()<17 || (hand.getScore()===17 && hand.isSoft())) hand.add(deck.draw()); hand.status=hand.isBust()?'bust':'stand'; }
