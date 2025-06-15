
let scores = [];
let playersA = [];
let playersB = [];
let teamAName = "Team A";
let teamBName = "Team B";

document.getElementById("setup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  teamAName = document.getElementById("teamAName").value.trim() || "Team A";
  teamBName = document.getElementById("teamBName").value.trim() || "Team B";

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

  const summaryRow = document.createElement("tr");
  summaryRow.id = "summary-row";
  summaryRow.innerHTML = "<td><strong>Hole Win</strong></td>";
  for (let h = 0; h < 18; h++) {
    summaryRow.innerHTML += "<td id='hole-win-" + h + "'>–</td>";
  }
  summaryRow.innerHTML += "<td>—</td>";
  table.appendChild(summaryRow);
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

  const teamAInitial = teamAName[0].toUpperCase();
  const teamBInitial = teamBName[0].toUpperCase();

  for (let h = 0; h < 18; h++) {
    const aStrokes = playersA.map(p => scores[p][h]).filter(v => v !== null).sort((a, b) => a - b);
    const bStrokes = playersB.map(p => scores[p][h]).filter(v => v !== null).sort((a, b) => a - b);
    const cell = document.getElementById("hole-win-" + h);

    let result = 0;
    for (let i = 0; i < Math.min(aStrokes.length, bStrokes.length); i++) {
      if (aStrokes[i] < bStrokes[i]) { result = 1; break; }
      if (bStrokes[i] < aStrokes[i]) { result = -1; break; }
    }

    if (result === 1) {
      teamAScore++;
      if (cell) cell.textContent = teamAInitial;
    } else if (result === -1) {
      teamBScore++;
      if (cell) cell.textContent = teamBInitial;
    } else {
      if (cell) cell.textContent = "–";
    }
  }

  let resultText = "All Square";
  if (teamAScore > teamBScore) resultText = teamAName + " +" + (teamAScore - teamBScore);
  else if (teamBScore > teamAScore) resultText = teamBName + " +" + (teamBScore - teamAScore);
  document.getElementById("team-score").textContent = resultText;
}
