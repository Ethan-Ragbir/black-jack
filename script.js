const deck = [];
const suits = ['♠', '♥', '♦', '♣'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let playerHand = [];
let dealerHand = [];

const playerHandDiv = document.getElementById('player-hand');
const dealerHandDiv = document.getElementById('dealer-hand');
const resultDiv = document.getElementById('result');
const playerScoreSpan = document.getElementById('player-score');
const dealerScoreSpan = document.getElementById('dealer-score');

function createDeck() {
  deck.length = 0;
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }
  shuffle(deck);
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function getCardValue(card) {
  if (['J', 'Q', 'K'].includes(card.value)) return 10;
  if (card.value === 'A') return 11;
  return parseInt(card.value);
}

function calculateScore(hand) {
  let score = 0;
  let aces = 0;
  for (let card of hand) {
    score += getCardValue(card);
    if (card.value === 'A') aces++;
  }
  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
}

function displayHands() {
  playerHandDiv.innerHTML = playerHand.map(card => `${card.value}${card.suit}`).join(' ');
  dealerHandDiv.innerHTML = dealerHand.map(card => `${card.value}${card.suit}`).join(' ');
  playerScoreSpan.textContent = calculateScore(playerHand);
  dealerScoreSpan.textContent = calculateScore(dealerHand);
}

function dealInitial() {
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  displayHands();
  checkWin();
}

function hitPlayer() {
  playerHand.push(deck.pop());
  displayHands();
  checkWin();
}

function stand() {
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }
  displayHands();
  checkWin(true);
}

function checkWin(stand = false) {
  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);
  if (playerScore > 21) {
    resultDiv.textContent = 'You bust! Dealer wins.';
  } else if (stand) {
    if (dealerScore > 21 || playerScore > dealerScore) {
      resultDiv.textContent = 'You win!';
    } else if (playerScore < dealerScore) {
      resultDiv.textContent = 'Dealer wins.';
    } else {
      resultDiv.textContent = 'Push (tie).';
    }
  }
}

document.getElementById('hit').addEventListener('click', hitPlayer);
document.getElementById('stand').addEventListener('click', stand);
document.getElementById('restart').addEventListener('click', () => {
  resultDiv.textContent = '';
  createDeck();
  dealInitial();
});

createDeck();
dealInitial();
