window.onload = () => {
  const table = document.getElementById('card-container');
  const speech = document.getElementById('dealer-speech');
  const hitBtn = document.getElementById('hit');
  const standBtn = document.getElementById('stand');
  const restartBtn = document.getElementById('restart');

  let deck = [];

  // Build & shuffle deck
  function buildDeck() {
    const suits = ['♠','♥','♦','♣'];
    const vals  = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    deck = [];
    suits.forEach(s => vals.forEach(v => deck.push({s,v})));
    deck.sort(() => Math.random() - 0.5);
  }

  // Deal card animation from dealer to center then to player
  function dealCard(toX, toY, hidden = false, delay = 0) {
    if (!deck.length) buildDeck();
    const {s,v} = deck.pop();
    // create card element
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.style.left = '50%';
    cardEl.style.top  = '20%';
    cardEl.style.transform = 'translate(-50%, -50%)';
    cardEl.style.transition = 'transform 0.6s ease ' + delay + 's';
    // faces
    const face = document.createElement('div');
    face.className = 'face';
    face.innerHTML = `<div>${v}</div><div>${s}</div>`;
    const back = document.createElement('div');
    back.className = 'back';
    cardEl.append(back, face);
    if (hidden) cardEl.classList.add('flip');
    table.append(cardEl);
    // animate to target
    requestAnimationFrame(() => {
      cardEl.style.transform = `translate(${toX}px, ${toY}px) rotateY(${hidden?180:0}deg)`;
      setTimeout(() => {
        // reveal if needed
        if (!hidden) face.style.visibility = 'visible';
      }, (delay+0.6)*1000);
    });
    return cardEl;
  }

  function speak(msg, ms=2000) {
    speech.textContent = msg;
    speech.classList.remove('hidden');
    setTimeout(() => speech.classList.add('hidden'), ms);
  }

  // Simple deal example
  function startDemo() {
    table.innerHTML = '';
    buildDeck();
    speak('Dealing cards...');
    // deal 2 cards to player
    dealCard(-100, 200, false, 0.2);
    dealCard( 100, 200, false, 0.4);
    // deal 2 to dealer
    dealCard(-100, -100, false, 0.6);
    dealCard( 100, -100, true, 0.8);
  }

  hitBtn.onclick = () => speak('Hit!');
  standBtn.onclick = () => speak('Stand!');
  restartBtn.onclick = () => startDemo();

  // start
  startDemo();
};
