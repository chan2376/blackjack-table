import express from 'express';
import cors from 'cors';
import { gameRouter } from './routes/game.js';
export const app=express();
app.use(cors());app.use(express.json());
app.get('/api/health',(_,res)=>res.json({ok:true,service:'BLACKJACK TABLE'}));
app.use('/api/game',gameRouter);
