window.onload = () => {
  // ——— Game state ———
  let bankroll = 0;
  let numHands = 1;
  const maxHands = 4;
  let hands = [];      // [{ bet, cards: [], state }]
  let deck = [];
  let dealerCards = [];

  // ——— DOM references ———
  const depoSec   = document.getElementById('deposit-section');
  const setupSec  = document.getElementById('bet-setup');
  const betsSec   = document.getElementById('bets-section');
  const handsBets = document.getElementById('hands-bets');
  const startBtn  = document.getElementById('start-game-btn');
  const speech    = document.getElementById('dealer-speech');
  const gameArea  = document.getElementById('game-area');
  const handsArea = document.getElementById('hands-area');
  const extras    = document.getElementById('extras');
  const insBtn    = document.getElementById('insurance-btn');
  const splitBtn  = document.getElementById('split-btn');
  const dblBtn    = document.getElementById('double-btn');

  // ——— Utility: speak in speech bubble ———
  function speak(msg, ms = 2000) {
    speech.textContent = msg;
    speech.classList.remove('hidden');
    setTimeout(() => speech.classList.add('hidden'), ms);
  }

  // ——— Utility: shuffle/build deck ———
  function buildDeck() {
    const suits = ['♠','♥','♦','♣'];
    const vals  = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    deck = [];
    for (let s of suits) for (let v of vals) deck.push({s,v});
    for (let i = deck.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [deck[i],deck[j]] = [deck[j],deck[i]];
    }
  }

  function dealOne(hidden=false) {
    const card = deck.pop();
    return {card,hidden};
  }
  function cardValue(v) {
    if (v==='A') return 11;
    if (['K','Q','J'].includes(v)) return 10;
    return +v;
  }
  function scoreOf(arr) {
    let score=0, aces=0;
    for (let c of arr) {
      score += cardValue(c.v);
      if (c.v==='A') aces++;
    }
    while(score>21 && aces){score-=10; aces--;}
    return score;
  }

  // ——— Phase 1: Deposit ———
  document.getElementById('deposit-btn').onclick = () => {
    const amt = +document.getElementById('deposit-input').value;
    if (!amt || amt<1) return alert('Enter a valid deposit');
    bankroll = amt;
    speak(`Bankroll: $${bankroll}`);
    depoSec.classList.add('hidden');
    setupSec.classList.remove('hidden');
  };

  // ——— Phase 2: Choose hands (max 4) ———
  document.getElementById('set-hands-btn').onclick = () => {
    let n = +document.getElementById('num-hands').value || 1;
    numHands = Math.min(maxHands, Math.max(1,n));
    speak(`You’ll play ${numHands} hand${numHands>1?'s':''}. Place your bets.`);
    setupSec.classList.add('hidden');
    betsSec.classList.remove('hidden');
    renderBetInputs();
  };

  // ——— Render bet inputs & chips ———
  function renderBetInputs() {
    handsBets.innerHTML = '';
    hands = [];
    const perMax = Math.floor(bankroll/numHands);
    for (let i=0; i<numHands; i++){
      hands[i] = {bet:perMax,cards:[],state:'betting'};
      const div = document.createElement('div');
      div.className='hand-bet';
      div.innerHTML = `
        <label>Hand ${i+1} Bet (max ${perMax}):</label>
        <input id="bet-${i}" type="number" min="1" max="${perMax}" value="${perMax}"/>
        <div class="chips">
          <button data-val="1">$1</button>
          <button data-val="5">$5</button>
          <button data-val="25">$25</button>
          <button data-val="100">$100</button>
        </div>
      `;
      // chip buttons
      div.querySelectorAll('.chips button').forEach(b=>{
        b.onclick = ()=>{
          let inp = div.querySelector('input');
          const v = Math.min(perMax, +inp.value + +b.dataset.val);
          inp.value = v;
        };
      });
      handsBets.append(div);
    }
    startBtn.onclick = startGame;
  }

  // ——— Phase 3: Deal initial hands ———
  function startGame() {
    let total=0;
    hands.forEach((h,i)=>{
      h.bet = +document.getElementById(`bet-${i}`).value||0;
      total += h.bet;
    });
    if(total>bankroll) return alert("You cannot bet more than your bankroll");
    bankroll -= total;
    document.getElementById('bankroll').textContent = bankroll;
    betsSec.classList.add('hidden');
    buildDeck();
    dealerCards = [];
    hands.forEach(h=>h.cards=[]);
    // deal two cards each
    dealerCards.push(dealOne(false), dealOne(true));
    hands.forEach(h=>{
      h.cards.push(dealOne(false), dealOne(false));
    });
    renderTable();
    speak('Hit or Stand?');
    // show insurance only if dealer upcard is Ace
    const up = dealerCards[0].card.v;
    if (up==='A') insBtn.parentNode.classList.remove('hidden');
    else insBtn.parentNode.classList.add('hidden');
  }

  // ——— Render dealer + player hands ———
  function renderTable() {
    gameArea.classList.remove('hidden');
    speech.classList.remove('hidden');
    handsArea.innerHTML = '';
    // dealer stub
    const dcDiv = document.getElementById('dealer-hand')||document.createElement('div');
    // ... you already have dealer-section in HTML; only reveal cards on stand
    // render each player hand
    hands.forEach((h,i)=>{
      const div = document.createElement('div');
      div.className='hand';
      div.innerHTML = `
        <h3>Hand ${i+1} ($${h.bet})</h3>
        <div class="cards" id="cards-p-${i}"></div>
        <div class="score" id="score-p-${i}">Score: ${scoreOf(h.cards.map(c=>c.card))}</div>
        <div class="controls">
          <button ${h.cards.length>2?'disabled':''} onclick="dbl(${i});">Double</button>
          <button ${h.cards[0].card.v!==h.cards[1].card.v?'disabled':''} onclick="spl(${i});">Split</button>
          <button onclick="hit(${i});">Hit</button>
          <button onclick="stand(${i});">Stand</button>
        </div>
      `;
      handsArea.append(div);
      const cardsDiv = div.querySelector(`#cards-p-${i}`);
      h.cards.forEach((ch,j)=>{
        const el = document.createElement('div');
        el.className = 'card ' + (ch.hidden?'back':'');
        if(!ch.hidden) {
          if(['♥','♦'].includes(ch.card.s)) el.classList.add('red');
          el.innerHTML = `<div>${ch.card.v}</div><div>${ch.card.s}</div>`;
        }
        cardsDiv.append(el);
      });
    });
    extras.classList.remove('hidden');
  }

  // ——— Player actions ———
  window.hit = (idx) => {
    const h = hands[idx];
    h.cards.push(dealOne(false));
    renderTable();
    if (scoreOf(h.cards.map(c=>c.card))>21) endHand(idx,'bust');
  };
  window.stand = (idx) => {
    endHand(idx,'stand');
  };
  window.dbl = (idx) => {
    // double: take one card, double bet
    const h = hands[idx];
    h.bet *=2; bankroll -= hands[idx].bet/2;
    h.cards.push(dealOne(false));
    renderTable();
    endHand(idx,'double');
  };
  window.spl = (idx) => {
    // splitting stub; you’d need to split array into two hands
    alert('Split not fully implemented yet');
  };

  function endHand(idx, reason) {
    speak(`Hand ${idx+1} ${reason}!`);
    // disable controls for that hand
    document.querySelector(`#score-p-${idx}`).textContent += ` (${reason})`;
  }

};
