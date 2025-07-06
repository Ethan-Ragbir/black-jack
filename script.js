window.onload = () => {
  let bankroll = 0;
  let numHands = 1;
  let hands = []; // each: { bet, cards: [], state }

  const depositSec   = document.getElementById('deposit-section');
  const betSetup     = document.getElementById('bet-setup');
  const betsSec      = document.getElementById('bets-section');
  const handsBetsDiv = document.getElementById('hands-bets');
  const gameArea     = document.getElementById('game-area');
  const handsArea    = document.getElementById('hands-area');
  const speech       = document.getElementById('dealer-speech');
  const extras       = document.getElementById('extras');
  const insuranceBtn = document.getElementById('insurance-btn');
  const splitBtn     = document.getElementById('split-btn');
  const doubleBtn    = document.getElementById('double-btn');

  // 1️⃣ Deposit
  document.getElementById('deposit-btn').onclick = () => {
    const amt = parseInt(document.getElementById('deposit-input').value);
    if (!amt || amt <= 0) return alert('Enter a valid deposit');
    bankroll = amt;
    speak(`Bankroll set to $${bankroll}`);
    depositSec.classList.add('hidden');
    betSetup.classList.remove('hidden');
  };

  // 2️⃣ Set Number of Hands
  document.getElementById('set-hands-btn').onclick = () => {
    numHands = parseInt(document.getElementById('num-hands').value) || 1;
    speak(`You have ${numHands} hand${numHands>1?'s':''}. Place your bets.`);
    betSetup.classList.add('hidden');
    betsSec.classList.remove('hidden');
    renderBets();
  };

  // Render bet inputs & chips for each hand
  function renderBets() {
    handsBetsDiv.innerHTML = '';
    hands = [];
    const perHandMax = Math.floor(bankroll / numHands);
    for (let i=0; i<numHands; i++){
      const wrapper = document.createElement('div');
      wrapper.className = 'hand-bet';
      wrapper.innerHTML = `
        <label>Hand ${i+1} Bet (max ${perHandMax}):</label>
        <input type="number" min="1" max="${perHandMax}" value="${perHandMax}" id="bet-${i}" />
        <div class="chips">
          $<button data-val="1">1</button>
          $<button data-val="5">5</button>
          $<button data-val="25">25</button>
          $<button data-val="100">100</button>
        </div>
      `;
      // chip clicks
      wrapper.querySelectorAll('.chips button').forEach(btn=>{
        btn.onclick = ()=>{
          let inp = wrapper.querySelector('input');
          inp.value = Math.min(perHandMax, parseInt(inp.value) + parseInt(btn.dataset.val));
        };
      });
      handsBetsDiv.appendChild(wrapper);
      hands.push({ bet: perHandMax, cards: [], state: 'betting' });
    }
    // Start game
    document.getElementById('start-game-btn').onclick = startGame;
  }

  // 3️⃣ Start Game (deal initial cards)
  function startGame(){
    // read bets
    let total = 0;
    hands.forEach((h,i)=>{
      h.bet = parseInt(document.getElementById(`bet-${i}`).value) || 0;
      total += h.bet;
    });
    if (total > bankroll) return alert('You cannot bet more than your bankroll');
    bankroll -= total;
    renderBankroll();
    betsSec.classList.add('hidden');
    gameArea.classList.remove('hidden');
    renderHands();
    speak('Hit or Stand?');
    // show extras if upcard Ace
    // extras.classList.remove('hidden'); // you can conditionally show
  }

  function renderBankroll(){
    document.getElementById('bankroll').textContent = bankroll;
  }

  // Setup each hand area
  function renderHands(){
    handsArea.innerHTML = '';
    hands.forEach((h,i)=>{
      const div = document.createElement('div');
      div.className = 'hand';
      div.id = `hand-area-${i}`;
      div.innerHTML = `<h3>Hand ${i+1}</h3>
                       <div class="cards" id="cards-${i}"></div>
                       <div class="score" id="score-${i}">Score: 0</div>
                       <div class="controls">
                         <button onclick="hit(${i})">Hit</button>
                         <button onclick="stand(${i})">Stand</button>
                       </div>`;
      handsArea.appendChild(div);
      // TODO: deal initial cards per hand
    });
  }

  // Sample speak function
  function speak(text, ms=2000){
    speech.textContent = text;
    speech.classList.remove('hidden');
    setTimeout(()=> speech.classList.add('hidden'), ms);
  }

  // TODO: implement hit/stand per hand, insurance, split, double
  window.hit = function(handIdx){
    speak(`You hit hand ${handIdx+1}`);
    // deal card + update UI...
  };
  window.stand = function(handIdx){
    speak(`You stand hand ${handIdx+1}`);
    // reveal dealer or next hand...
  };
};
