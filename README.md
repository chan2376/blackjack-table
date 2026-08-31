# BLACKJACK TABLE

A premium browser blackjack table for one player versus a dealer AI. The game uses virtual chips only; there are no deposits, withdrawals, cash prizes, or cash-convertible rewards.

## Features
- 52-card deck with cryptographically secure server-side shuffle
- Ace-aware hand scoring
- Dealer stands on hard 17 and hits soft 17
- Blackjack pays 3:2
- Normal wins pay 1:1; pushes return the wager
- Hit, Stand and Double Down
- Server-authoritative game state and payouts
- Hidden dealer hole card is never sent to the browser during the player turn
- Session statistics
- Responsive premium table UI
- Rules modal and sound toggle UI

## Tech Stack
- React + TypeScript + Vite
- Node.js + Express + TypeScript
- Vitest

## Project Structure
`client/` contains the browser UI. `server/src/blackjack/` contains the pure blackjack engine. `server/src/routes/` exposes the authoritative API.

## How to Run
Requirements: Node.js 20+.

```bash
npm install
npm run dev
```

Client: http://localhost:5173  
API: http://localhost:3001

## Game Rules
- Player starts with 10,000 virtual chips.
- Valid bets are positive integers up to 1,000,000 and cannot exceed the balance.
- Dealer stands on 17 or higher and hits on soft 17.
- Blackjack is an initial two-card 21 and pays 3:2.
- A normal win pays 1:1.
- A push returns the original bet.
- Double Down is available on the initial two cards when the player can cover the additional wager.

## Testing
```bash
npm test
npm run build
```

The engine accepts an injectable `Deck`, allowing deterministic rule tests without relying on random cards.
