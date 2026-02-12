const fixturesContainer = document.querySelector('#fixtures');
const statusText = document.querySelector('#status');
const template = document.querySelector('#fixtureTemplate');
const refreshBtn = document.querySelector('#refreshBtn');

const API_KEY = "4d462e0edd4a473b8012c9b246108674";

const API_URL =
  "https://api.football-data.org/v4/competitions/PL/matches?status=FINISHED";

const seededNumber = (text) => {
  let hash = 0;
  for (const char of text) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
};

const predictMatch = (home, away) => {
  const homePower = seededNumber(home);
  const awayPower = seededNumber(away);

  const delta = homePower - awayPower;

  const homeWin = 1 / (1 + Math.exp(-3 * delta));
  const draw = 0.2;
  const awayWin = 1 - homeWin - draw;

  return {
    home: Math.round(homeWin * 100),
    draw: Math.round(draw * 100),
    away: Math.round(awayWin * 100),
  };
};

const renderFixtures = (matches) => {
  fixturesContainer.innerHTML = "";

  matches.forEach(match => {
    const fragment = template.content.cloneNode(true);

    const nameEl = fragment.querySelector(".fixture__name");
    const leagueEl = fragment.querySelector(".fixture__league");
    const timeEl = fragment.querySelector(".fixture__time");
    const scoreEl = fragment.querySelector(".fixture__score");
    const predictionEl = fragment.querySelector(".fixture__prediction");

    const home = match.homeTeam.name;
    const away = match.awayTeam.name;

    nameEl.textContent = `${home} vs ${away}`;
    leagueEl.textContent = `Competition: Premier League`;

    const date = new Date(match.utcDate);
    timeEl.textContent = `Played: ${date.toLocaleDateString()}`;

    scoreEl.textContent =
      `Final score: ${match.score.fullTime.home}-${match.score.fullTime.away}`;

    const prediction = predictMatch(home, away);
    predictionEl.textContent =
      `Prediction → Home ${prediction.home}% · Draw ${prediction.draw}% · Away ${prediction.away}%`;

    fixturesContainer.appendChild(fragment);
  });
};

const loadFixtures = async () => {
  statusText.textContent = "Loading Premier League matches...";
  refreshBtn.disabled = true;

  try {
    const response = await fetch(API_URL, {
      headers: {
        "X-Auth-Token": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    const matches = data.matches
      .slice(-10)
      .reverse();

    statusText.textContent =
      `Showing ${matches.length} latest Premier League matches`;

    renderFixtures(matches);

  } catch (err) {
    statusText.textContent = "Failed to load matches.";
    console.error(err);
  }

  refreshBtn.disabled = false;
};

refreshBtn.addEventListener("click", loadFixtures);
loadFixtures();
