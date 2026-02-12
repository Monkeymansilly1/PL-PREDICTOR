const fixturesContainer = document.querySelector('#fixtures');
const statusText = document.querySelector('#status');
const template = document.querySelector('#fixtureTemplate');
const refreshBtn = document.querySelector('#refreshBtn');

const LAST_URL =
  "https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=133604";

const NEXT_URL =
  "https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=133604";

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

    if (event.intHomeScore !== null && event.intHomeScore !== undefined) {
      scoreEl.textContent =
        `Final score: ${event.intHomeScore}-${event.intAwayScore}`;
    } else {
      scoreEl.textContent = "Upcoming Fixture";
    }

    fixturesContainer.appendChild(fragment);
  });
};

const loadFixtures = async () => {
  statusText.textContent = "Loading West Ham fixtures...";
  refreshBtn.disabled = true;

  try {
    const [lastRes, nextRes] = await Promise.all([
      fetch(LAST_URL),
      fetch(NEXT_URL)
    ]);

    const lastData = await lastRes.json();
    const nextData = await nextRes.json();

    const lastMatches = lastData.events || [];
    const nextMatches = nextData.events || [];

    const combined = [...nextMatches, ...lastMatches].slice(0, 10);

    if (!combined.length) {
      statusText.textContent = "No fixtures found.";
      return;
    }

    statusText.textContent =
      `Showing ${combined.length} West Ham fixtures`;

    renderFixtures(combined);

  } catch (err) {
    statusText.textContent = "Failed to load matches.";
    console.error(err);
  }

  refreshBtn.disabled = false;
};

refreshBtn.addEventListener("click", loadFixtures);
loadFixtures();
