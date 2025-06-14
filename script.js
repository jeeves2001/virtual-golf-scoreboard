
let currentHole = 1;
let scores = [];
let playersA = [];
let playersB = [];

document.getElementById("setup-form").addEventListener("submit", function(e) {
  e.preventDefault();
  playersA = document.getElementById("teamA").value.split(",").map(p => p.trim());
  playersB = document.getElementById("teamB").value.split(",").map(p => p.trim());
  scores = Array(18).fill().map(() => ({ A: {}, B: {} }));
  document.getElementById("setup-form").style.display = "none";
  document.getElementById("score-section").style.display = "block";
  renderHole();
});

function renderHole() {
  document.getElementById("hole-number").textContent = currentHole;
  const container = document.getElementById("score-inputs");
  container.innerHTML = "<h4>Enter scores:</h4>";
  [...playersA, ...playersB].forEach(player => {
    container.innerHTML += \`
      <label>\${player}:</label>
      <input type="number" min="1" id="score-\${player}" />
    \`;
  });
}

function calculateMatchPlay() {
  let score = 0;
  for (let h = 0; h < currentHole; h++) {
    let minA = Math.min(...Object.values(scores[h].A));
    let minB = Math.min(...Object.values(scores[h].B));
    if (minA < minB) score++;
    else if (minB < minA) score--;
  }
  if (score === 0) return "All Square";
  return score > 0 ? \`Team A +\${score}\` : \`Team B +\${-score}\`;
}

document.getElementById("next-hole").addEventListener("click", function() {
  [...playersA].forEach(p => {
    scores[currentHole - 1].A[p] = parseInt(document.getElementById("score-" + p).value);
  });
  [...playersB].forEach(p => {
    scores[currentHole - 1].B[p] = parseInt(document.getElementById("score-" + p).value);
  });
  currentHole++;
  if (currentHole > 18) {
    document.getElementById("score-section").innerHTML = "<h2>Game Over</h2><p>Final Score: " + calculateMatchPlay() + "</p>";
  } else {
    renderHole();
    document.getElementById("team-score").textContent = calculateMatchPlay();
  }
});
