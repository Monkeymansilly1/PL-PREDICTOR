const fixturesContainer = document.querySelector('#fixtures');
const statusText = document.querySelector('#status');
const template = document.querySelector('#fixtureTemplate');
const refreshBtn = document.querySelector('#refreshBtn');

const API_URL = "https://www.thesportsdb.com/api/v1/json/3/eventspastleague.php?id=4328";

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
  const draw = 0.20;
  const awayWin = 1 - homeWin - draw;

  return {
    home: Math.round(homeWin * 100),
    draw: Math.round(draw * 100),
    away: Math.round(awayWin * 100),
  };
};

const renderFixtures = (events) => {
  fixturesContainer.innerHTML = "";

  for (const event of events) {
    const fragment = template.content.cloneNode(true);

    const nameEl = fragment.querySelector(".fixture__name");
    const leagueEl = fragment.querySelector(".fixture__league");
    const timeEl = fragment.querySelector(".fixture__time");
    const scoreEl = fragment.querySelector(".fixture__score");
    const predictionEl = fragment.querySelector(".fixture__prediction");

    const home = event.strHomeTeam;
    const away = event.strAwayTeam;

    nameEl.textContent = `${home} vs ${away}`;
    leagueEl.textContent = `Competition: ${event.strLeague}`;

    const date = new Date(event.dateEvent);
    timeEl.textContent = `Played: ${date.toLocaleDateString()}`;

    scoreEl.textContent = `Final score: ${event.intHomeScore}-${event.intAwayScore}`;

    const prediction = predictMatch(home, away);
    predictionEl.textContent =
      `Prediction → Home ${prediction.home}% · Draw ${prediction.draw}% · Away ${prediction.away}%`;

    fixturesContainer.appendChild(fragment);
  }
};

const loadFixtures = async () => {
  statusText.textContent = "Loading latest matches...";
  refreshBtn.disabled = true;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    const events = (data.events || [])
      .sort((a, b) => new Date(b.dateEvent) - new Date(a.dateEvent))
      .slice(0, 10);

    statusText.textContent = `Showing ${events.length} latest matches`;
    renderFixtures(events);

  } catch (err) {
    statusText.textContent = "Failed to load matches.";
    console.error(err);
  }

  refreshBtn.disabled = false;
};

refreshBtn.addEventListener("click", loadFixtures);
loadFixtures();
