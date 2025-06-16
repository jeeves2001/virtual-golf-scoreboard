
let scores = {};
let playersA = [], playersB = [];
let teamAName = "Team A", teamBName = "Team B";
let scoringMode = "skins";

document.getElementById("setup-form").addEventListener("submit", function (e) {
  e.preventDefault();
  teamAName = document.getElementById("teamAName").value || "Team A";
  teamBName = document.getElementById("teamBName").value || "Team B";
  scoringMode = document.getElementById("scoring-mode").value;
  playersA = document.getElementById("teamA").value.split(',').map(s => s.trim());
  playersB = document.getElementById("teamB").value.split(',').map(s => s.trim());
  [...playersA, ...playersB].forEach(p => scores[p] = Array(18).fill(null));
  document.getElementById("setup-form").style.display = "none";
  document.getElementById("score-section").style.display = "block";
  renderScorecard();
  updateMatchPlayScore();
});

function renderScorecard() {
  const table = document.getElementById("scorecard");
  table.innerHTML = "";
  const header = "<tr><th>Player</th>" + Array.from({length: 18}, (_, i) => `<th>${i+1}</th>`).join("") + "<th>Total</th></tr>";
  table.innerHTML += header;
  const allPlayers = [...playersA, ...playersB];
  allPlayers.forEach(player => {
    let row = `<tr><td>${player}</td>`;
    for (let i = 0; i < 18; i++) {
      row += `<td><input type='number' data-player='${player}' data-hole='${i}' class='score-input' /></td>`;
    }
    row += `<td id="total-${player}">0</td></tr>`;
    table.innerHTML += row;
  });
  let winRow = "<tr><td><strong>Hole Win</strong></td>";
  for (let i = 0; i < 18; i++) winRow += `<td id="hole-win-${i}">–</td>`;
  winRow += "<td>—</td></tr>";
  table.innerHTML += winRow;

  document.querySelectorAll(".score-input").forEach(input => {
    input.addEventListener("input", onScoreChange);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const p = input.dataset.player;
        const h = parseInt(input.dataset.hole);
        const all = [...playersA, ...playersB];
        const nextP = all[all.indexOf(p) + 1];
        const next = document.querySelector(`input[data-player="${nextP}"][data-hole="${h}"]`);
        if (next) next.focus();
      }
    });
  });
}

function onScoreChange(e) {
  const player = e.target.dataset.player;
  const hole = parseInt(e.target.dataset.hole);
  const val = parseInt(e.target.value);
  if (!isNaN(val)) scores[player][hole] = val;
  else scores[player][hole] = null;
  document.getElementById("total-" + player).textContent = scores[player].reduce((s, v) => s + (v || 0), 0);
  updateMatchPlayScore();
}

function updateMatchPlayScore() {
  let aWins = 0, bWins = 0;
  for (let h = 0; h < 18; h++) {
    const aScores = playersA.map(p => scores[p][h]).filter(v => v !== null).sort((a,b) => a-b);
    const bScores = playersB.map(p => scores[p][h]).filter(v => v !== null).sort((a,b) => a-b);
    let winner = "tie";
    if (aScores.length && bScores.length) {
      if (aScores[0] < bScores[0]) winner = "A";
      else if (bScores[0] < aScores[0]) winner = "B";
      else if (scoringMode === "skins") {
        for (let i = 1; i < Math.min(aScores.length, bScores.length); i++) {
          if (aScores[i] < bScores[i]) { winner = "A"; break; }
          if (bScores[i] < aScores[i]) { winner = "B"; break; }
        }
      }
    }
    if (winner === "A") aWins++;
    else if (winner === "B") bWins++;
    document.getElementById("hole-win-" + h).textContent = winner === "tie" ? "–" : (winner === "A" ? teamAName[0] : teamBName[0]);
  }
  document.getElementById("team-score").textContent =
    aWins === bWins ? "All Square" :
    aWins > bWins ? `${teamAName} +${aWins - bWins}` :
    `${teamBName} +${bWins - aWins}`;
}
