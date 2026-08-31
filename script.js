(() => {
  'use strict';

  const STARTING_BALANCE = 10000;
  const BET_LIMIT = 1000000;
  const SUITS = ['♠','♥','♦','♣'];
  const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  const state = {
    balance: Number(localStorage.getItem('bj_balance')) || STARTING_BALANCE,
    stats: JSON.parse(localStorage.getItem('bj_stats') || '{"handsPlayed":0,"wins":0,"losses":0,"pushes":0,"blackjacks":0}'),
    bet: 100,
    phase: 'betting',
    player: [], dealer: [], hiddenDealer: true, result: '', payout: 0
  };

  const $ = id => document.getElementById(id);
  const balanceEl=$('balance'), playerHandEl=$('playerHand'), dealerHandEl=$('dealerHand'), playerScoreEl=$('playerScore'), dealerScoreEl=$('dealerScore');
  const resultEl=$('result'), errorEl=$('error'), betInput=$('betInput'), currentBet=$('currentBet');
  const betControls=$('betControls'), actionControls=$('actionControls'), roundControls=$('roundControls');

  function save(){ localStorage.setItem('bj_balance',String(state.balance)); localStorage.setItem('bj_stats',JSON.stringify(state.stats)); }
  function fmt(n){ return n.toLocaleString('en-US'); }
  function showError(msg){ errorEl.textContent=msg; errorEl.classList.remove('hidden'); clearTimeout(showError.t); showError.t=setTimeout(()=>errorEl.classList.add('hidden'),2600); }
  function shuffle(deck){ for(let i=deck.length-1;i>0;i--){ const j=Math.floor(crypto.getRandomValues(new Uint32Array(1))[0]/4294967296*(i+1)); [deck[i],deck[j]]=[deck[j],deck[i]]; } return deck; }
  function newDeck(){ const d=[]; for(const suit of SUITS) for(const rank of RANKS) d.push({suit,rank}); return shuffle(d); }
  let deck=newDeck();
  function draw(){ if(!deck.length) deck=newDeck(); return deck.pop(); }
  function score(cards){ let total=0, aces=0; for(const c of cards){ if(c.rank==='A'){total+=11;aces++;} else total+=['J','Q','K'].includes(c.rank)?10:Number(c.rank); } while(total>21&&aces){total-=10;aces--;} return {total,soft:aces>0}; }
  function blackjack(cards){ return cards.length===2&&score(cards).total===21; }
  function renderCard(c,hidden=false){ const el=document.createElement('div'); el.className='card'+(hidden?' hidden-card':''); if(hidden){el.textContent='✦';el.setAttribute('aria-label','Hidden card');return el;} if(c.suit==='♥'||c.suit==='♦')el.classList.add('red'); el.innerHTML=`<b>${c.rank}</b><span class="suit">${c.suit}</span>`; el.setAttribute('aria-label',`${c.rank} of ${c.suit}`); return el; }
  function render(){
    balanceEl.textContent=fmt(state.balance); currentBet.textContent=fmt(validBet()?state.bet:0); betInput.value=state.bet;
    playerHandEl.innerHTML=''; dealerHandEl.innerHTML=''; state.player.forEach(c=>playerHandEl.appendChild(renderCard(c))); state.dealer.forEach((c,i)=>dealerHandEl.appendChild(renderCard(c,state.hiddenDealer&&i===1)));
    playerScoreEl.textContent=state.player.length?score(state.player).total:'—'; dealerScoreEl.textContent=state.hiddenDealer?'?':(state.dealer.length?score(state.dealer).total:'—');
    resultEl.className='result'+(state.result?'':' hidden')+(state.result==='PUSH'?' push':state.result==='DEALER WINS'?' lose':''); resultEl.innerHTML=state.result?`${state.result}<small>${state.result==='BLACKJACK'?`+${fmt(state.payout)} chips`:state.result==='PUSH'?'Bet returned':`${state.payout>=0?'+':''}${fmt(state.payout)} chips`}</small>`:'';
    betControls.classList.toggle('hidden',state.phase!=='betting'); actionControls.classList.toggle('hidden',state.phase!=='player'); roundControls.classList.toggle('hidden',state.phase!=='result');
    ['hands','wins','losses','pushes','blackjacks'].forEach(k=>$(k).textContent=fmt(state.stats[k==='hands'?'handsPlayed':k]||0));
    document.querySelectorAll('.chip').forEach(b=>b.classList.toggle('selected',Number(b.dataset.bet)===state.bet));
    $('doubleBtn').disabled=!(state.phase==='player'&&state.player.length===2&&state.balance>=state.bet);
  }
  function validBet(){return Number.isInteger(state.bet)&&state.bet>0&&state.bet<=state.balance&&state.bet<=BET_LIMIT;}
  function finish(result,payout){ state.phase='result'; state.result=result; state.payout=payout; state.hiddenDealer=false; state.stats.handsPlayed++; if(result==='PUSH')state.stats.pushes++; else if(result==='DEALER WINS')state.stats.losses++; else {state.stats.wins++; if(result==='BLACKJACK')state.stats.blackjacks++;} state.balance+=state.bet+payout; save(); render(); }
  function dealerPlay(){ state.phase='dealer'; state.hiddenDealer=false; render(); while(true){const s=score(state.dealer); if(s.total<17 || (s.total===17&&s.soft)){state.dealer.push(draw());render();}else break;} const p=score(state.player).total,d=score(state.dealer).total; if(d>21)finish('YOU WIN',state.bet); else if(p>d)finish('YOU WIN',state.bet); else if(p<d)finish('DEALER WINS',0); else finish('PUSH',0); }
  function deal(){ if(!validBet()){showError('Invalid bet or insufficient chips');return;} state.balance-=state.bet; state.player=[draw(),draw()]; state.dealer=[draw(),draw()]; state.hiddenDealer=true; state.result=''; state.payout=0; state.phase='player'; if(blackjack(state.player)){ if(blackjack(state.dealer))finish('PUSH',0); else finish('BLACKJACK',Math.floor(state.bet*1.5)); } else if(blackjack(state.dealer)){state.hiddenDealer=false;finish('DEALER WINS',0);} else render(); }
  function hit(){ if(state.phase!=='player'){showError('You cannot hit right now');return;} state.player.push(draw()); const s=score(state.player); if(s.total>21)finish('DEALER WINS',0); else if(s.total===21)dealerPlay(); else render(); }
  function stand(){ if(state.phase!=='player'){showError('You cannot stand right now');return;} dealerPlay(); }
  function doubleDown(){ if(state.phase!=='player'||state.player.length!==2){showError('Double Down is only available on the first two cards');return;} if(state.balance<state.bet){showError('Insufficient chips');return;} state.balance-=state.bet;state.bet*=2;state.player.push(draw());const s=score(state.player);if(s.total>21)finish('DEALER WINS',0);else dealerPlay(); }
  function newRound(){state.phase='betting';state.player=[];state.dealer=[];state.hiddenDealer=true;state.result='';state.payout=0;state.bet=Math.min(100,state.balance||0);if(state.balance<=0){state.balance=STARTING_BALANCE;save();}render();}

  document.querySelectorAll('.chip').forEach(b=>b.addEventListener('click',()=>{state.bet=Number(b.dataset.bet);render();}));
  betInput.addEventListener('input',e=>{const n=Number(e.target.value);state.bet=n;render();});
  $('dealBtn').addEventListener('click',deal); $('hitBtn').addEventListener('click',hit); $('standBtn').addEventListener('click',stand); $('doubleBtn').addEventListener('click',doubleDown); $('newRoundBtn').addEventListener('click',newRound);
  $('rulesBtn').addEventListener('click',()=>$('rulesModal').classList.remove('hidden')); $('closeRules').addEventListener('click',()=>$('rulesModal').classList.add('hidden')); $('closeRulesBottom').addEventListener('click',()=>$('rulesModal').classList.add('hidden')); $('rulesModal').addEventListener('click',e=>{if(e.target.id==='rulesModal')$('rulesModal').classList.add('hidden');});
  let soundOn=true; $('soundBtn').addEventListener('click',()=>{soundOn=!soundOn;$('soundBtn').textContent=soundOn?'🔊':'🔇';});
  document.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='h')hit();if(e.key.toLowerCase()==='s')stand();if(e.key.toLowerCase()==='d')doubleDown();});
  render();
})();
