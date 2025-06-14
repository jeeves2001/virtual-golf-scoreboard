
let scores = [];
let playersA = [];
let playersB = [];

document.getElementById("setup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  playersA = document.getElementById("teamA").value.split(",").map(p => p.trim()).filter(p => p);
  playersB = document.getElementById("teamB").value.split(",").map(p => p.trim()).filter(p => p);

  if (playersA.length === 0 || playersB.length === 0) {
    alert("Please enter at least one player per team.");
    return;
  }

  const allPlayers = [...playersA, ...playersB];
  scores = {};
  allPlayers.forEach(p => {
    scores[p] = Array(18).fill(null);
  });

  document.getElementById("setup-form").style.display = "none";
  document.getElementById("score-section").style.display = "block";
  renderScorecard();
  updateMatchPlayScore();
});

function renderScorecard() {
  const table = document.getElementById("scorecard");
  table.innerHTML = "";

  const headerRow = document.createElement("tr");
  headerRow.innerHTML = "<th>Player</th>";
  for (let i = 1; i <= 18; i++) {
    headerRow.innerHTML += "<th>" + i + "</th>";
  }
  headerRow.innerHTML += "<th>Total</th>";
  table.appendChild(headerRow);

  const makePlayerRow = (player) => {
    const row = document.createElement("tr");
    row.innerHTML = "<td>" + player + "</td>";
    for (let h = 0; h < 18; h++) {
      const td = document.createElement("td");
      const input = document.createElement("input");
      input.type = "number";
      input.min = 1;
      input.className = "score-input";
      input.value = scores[player][h] || "";
      input.dataset.player = player;
      input.dataset.hole = h;
      input.addEventListener("input", onScoreChange);
      td.appendChild(input);
      row.appendChild(td);
    }
    const totalTd = document.createElement("td");
    totalTd.id = "total-" + player;
    totalTd.textContent = calculatePlayerTotal(player);
    row.appendChild(totalTd);
    return row;
  };

  playersA.forEach(p => table.appendChild(makePlayerRow(p)));
  playersB.forEach(p => table.appendChild(makePlayerRow(p)));
}

function onScoreChange(e) {
  const player = e.target.dataset.player;
  const hole = parseInt(e.target.dataset.hole);
  const val = parseInt(e.target.value);
  if (!isNaN(val)) {
    scores[player][hole] = val;
  } else {
    scores[player][hole] = null;
  }
  document.getElementById("total-" + player).textContent = calculatePlayerTotal(player);
  updateMatchPlayScore();
}

function calculatePlayerTotal(player) {
  return scores[player].reduce((sum, val) => sum + (val || 0), 0);
}

function updateMatchPlayScore() {
  let teamAScore = 0;
  let teamBScore = 0;

  for (let h = 0; h < 18; h++) {
    const aStrokes = playersA.map(p => scores[p][h]).filter(v => v !== null);
    const bStrokes = playersB.map(p => scores[p][h]).filter(v => v !== null);

    if (aStrokes.length && bStrokes.length) {
      const minA = Math.min(...aStrokes);
      const minB = Math.min(...bStrokes);
      if (minA < minB) teamAScore++;
      else if (minB < minA) teamBScore++;
    }
  }

  let result = "All Square";
  if (teamAScore > teamBScore) result = "Team A +" + (teamAScore - teamBScore);
  else if (teamBScore > teamAScore) result = "Team B +" + (teamBScore - teamAScore);
  document.getElementById("team-score").textContent = result;
}
