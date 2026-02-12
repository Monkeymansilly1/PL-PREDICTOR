const fixturesContainer = document.querySelector('#fixtures');
const statusText = document.querySelector('#status');
const template = document.querySelector('#fixtureTemplate');
const refreshBtn = document.querySelector('#refreshBtn');

// West Ham team ID
const API_URL =
  "https://www.thesportsdb.com/api/v1/json/3/eventsseason.php?id=133604&s=2025-2026";

const renderFixtures = (events) => {
  fixturesContainer.innerHTML = "";

  events.forEach(event => {
    const fragment = template.content.cloneNode(true);

    const nameEl = fragment.querySelector(".fixture__name");
    const leagueEl = fragment.querySelector(".fixture__league");
    const timeEl = fragment.querySelector(".fixture__time");
    const scoreEl = fragment.querySelector(".fixture__score");

    nameEl.textContent = `${event.strHomeTeam} vs ${event.strAwayTeam}`;
    leagueEl.textContent = `Competition: ${event.strLeague}`;

    const date = new Date(event.dateEvent);
    timeEl.textContent = `Date: ${date.toLocaleDateString()}`;

    if (event.intHomeScore !== null) {
      scoreEl.textContent =
        `Final score: ${event.intHomeScore}-${event.intAwayScore}`;
    } else {
      scoreEl.textContent = "Upcoming Fixture";
    }

    fixturesContainer.appendChild(fragment);
  });
};

const loadFixtures = async () => {
  statusText.textContent = "Loading West Ham season fixtures...";
  refreshBtn.disabled = true;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!data.events) {
      statusText.textContent = "No season data found.";
      return;
    }

    // Filter only West Ham matches (extra safety)
    const westHamMatches = data.events
      .filter(event =>
        event.strHomeTeam === "West Ham United" ||
        event.strAwayTeam === "West Ham United"
      )
      .slice(0, 10);

    statusText.textContent =
      `Showing ${westHamMatches.length} West Ham fixtures`;

    renderFixtures(westHamMatches);

  } catch (err) {
    statusText.textContent = "Failed to load matches.";
    console.error(err);
  }

  refreshBtn.disabled = false;
};

refreshBtn.addEventListener("click", loadFixtures);
loadFixtures();
