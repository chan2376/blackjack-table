import { Router } from 'express';
import { BlackjackGame } from '../blackjack/BlackjackGame.js';
const games=new Map<string,BlackjackGame>();
export const gameRouter=Router();
const getGame=(id:string)=>{let g=games.get(id);if(!g){g=new BlackjackGame();games.set(id,g);}return g;};
gameRouter.get('/:id',(req,res)=>res.json(getGame(req.params.id).getState()));
gameRouter.post('/:id/action',(req,res)=>{try{const g=getGame(req.params.id);const {action,amount}=req.body??{};if(action==='placeBet')g.placeBet(Number(amount));else if(action==='hit')g.hit();else if(action==='stand')g.stand();else if(action==='doubleDown')g.doubleDown();else if(action==='newRound')g.newRound();else return res.status(400).json({error:'Unknown action'});res.json(g.getState());}catch(e){res.status(400).json({error:e instanceof Error?e.message:'Invalid action'});}});
