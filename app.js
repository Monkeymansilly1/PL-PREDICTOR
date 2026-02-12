const fixturesContainer = document.querySelector('#fixtures');
const statusText = document.querySelector('#status');
const template = document.querySelector('#fixtureTemplate');
const refreshBtn = document.querySelector('#refreshBtn');

// ✅ West Ham United - LAST matches (always returns data)
const API_URL =
  "https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=133604";

const renderFixtures = (events) => {
  fixturesContainer.innerHTML = "";

  events.forEach(event => {
    const fragment = template.content.cloneNode(true);

    const nameEl = fragment.querySelector(".fixture__name");
    const leagueEl = fragment.querySelector(".fixture__league");
    const timeEl = fragment.querySelector(".fixture__time");
    const scoreEl = fragment.querySelector(".fixture__score");
    const predictionEl = fragment.querySelector(".fixture__prediction");

    nameEl.textContent = `${event.strHomeTeam} vs ${event.strAwayTeam}`;
    leagueEl.textContent = `Competition: ${event.strLeague}`;

    const date = new Date(event.dateEvent);
    timeEl.textContent = `Played: ${date.toLocaleDateString()}`;

    scoreEl.textContent =
      `Final score: ${event.intHomeScore}-${event.intAwayScore}`;

    predictionEl.textContent = "";

    fixturesContainer.appendChild(fragment);
  });
};

const loadFixtures = async () => {
  statusText.textContent = "Loading recent West Ham matches...";
  refreshBtn.disabled = true;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!data.events) {
      statusText.textContent = "No recent matches found.";
      return;
    }

    const events = data.events.slice(0, 10);

    statusText.textContent =
      `Showing ${events.length} recent West Ham matches`;

    renderFixtures(events);

  } catch (err) {
    statusText.textContent = "Failed to load matches.";
    console.error(err);
  }

  refreshBtn.disabled = false;
};

refreshBtn.addEventListener("click", loadFixtures);
loadFixtures();
