body {
  margin: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #116530;
  color: white;
  text-align: center;
}

.casino {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}

h1 {
  margin-bottom: 10px;
}

.bankroll {
  font-size: 1.2em;
  margin-bottom: 20px;
}

.bet-area {
  margin-bottom: 20px;
}

.bet-area input {
  width: 80px;
  font-size: 1em;
  padding: 5px;
  text-align: center;
}

.hand {
  margin: 20px;
}

.cards {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.card {
  width: 60px;
  height: 90px;
  background: white;
  color: black;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  font-weight: bold;
  position: relative;
}

.card.red {
  color: red;
}

.card.back {
  background: repeating-linear-gradient(45deg, #444 0, #444 5px, #222 5px, #222 10px);
  color: transparent;
  pointer-events: none;
}

.score {
  margin-top: 10px;
  font-size: 1.1em;
}

.controls {
  margin: 20px;
}

button {
  padding: 10px 20px;
  font-size: 1em;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #f1c40f;
  color: #222;
  transition: 0.2s ease-in-out;
}

button:hover {
  background-color: #f39c12;
}

.hidden {
  display: none;
}

#result {
  font-size: 1.5em;
  margin-top: 20px;
  font-weight: bold;
}
