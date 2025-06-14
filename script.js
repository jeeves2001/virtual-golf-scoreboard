let currentHole = 1;
let scores = [];
let playersA = [];
let playersB = [];

document.getElementById("setup-form").addEventListener("submit", function (e) {
  e.preventDefault();

  playersA = document.getElementById("teamA").value.split(",").map(function (p) {
    return p.trim();
  }).filter(function (p) {
    return p.length > 0;
  });

  playersB = document.getElementById("teamB").value.split(",").map(function (p) {
    return p.trim();
  }).filter(function (p) {
    return p.length > 0;
  });

  if (playersA.length === 0 || playersB.length === 0) {
    alert("Please enter at least one player per team.");
    return;
  }

  scores = Array(18).fill().map(function () {
    return { A: {}, B: {} };
  });

  document.getElementById("setup-form").style.display = "none";
  document.getElementById("score-section").style.display = "block";
  renderHole();
  document.getElementById("team-score").textContent = calculateMatchPlay();
});

function renderHole() {
  document.getElementById("hole-number").textContent = currentHole;
  var container = document.getElementById("score-inputs");
  container.innerHTML = "<h4>Enter scores:</h4>";

  var allPlayers = playersA.concat(playersB);
  allPlayers.forEach(function (player) {
    container.innerHTML +=
      '<label>' + player + ':</label>' +
      '<input type="number" min="1" id="score-' + player + '" required />';
  });
}

function calculateMatchPlay() {
  var score = 0;

  for (var h = 0; h < currentHole; h++) {
    var strokesA = Object.values(scores[h].A);
    var strokesB = Object.values(scores[h].B);
    if (strokesA.length === 0 || strokesB.length === 0) continue;

    var minA = Math.min.apply(null, strokesA);
    var minB = Math.min.apply(null, strokesB);

    if (isNaN(minA) || isNaN(minB)) continue;

    if (minA < minB) score++;
    else if (minB < minA) score--;
  }

  if (score === 0) return "All Square";
  return score > 0 ? "Team A +" + score : "Team B +" + (-score);
}

document.getElementById("next-hole").addEventListener("click", function () {
  try {
    playersA.forEach(function (p) {
      var input = document.getElementById("score-" + p);
      var val = parseInt(input.value);
      if (isNaN(val)) throw new Error("Missing score for " + p);
      scores[currentHole - 1].A[p] = val;
    });

    playersB.forEach(function (p) {
      var input = document.getElementById("score-" + p);
      var val = parseInt(input.value);
      if (isNaN(val)) throw new Error("Missing score for " + p);
      scores[currentHole - 1].B[p] = val;
    });

    currentHole++;

    if (currentHole > 18) {
      document.getElementById("score-section").innerHTML =
        "<h2>Game Over</h2><p>Final Score: " + calculateMatchPlay() + "</p>";
    } else {
      renderHole();
      document.getElementById("team-score").textContent = calculateMatchPlay();
    }
  } catch (err) {
    alert(err.message);
  }
});
