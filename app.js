const fixturesContainer = document.querySelector('#fixtures');
const statusText = document.querySelector('#status');
const template = document.querySelector('#fixtureTemplate');
const refreshBtn = document.querySelector('#refreshBtn');

// ✅ West Ham United = 133636
const LAST_URL = "https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=133636";
const NEXT_URL = "https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=133636";

const renderFixtures = (events) => {
  fixturesContainer.innerHTML = "";

  events.forEach((event) => {
    const fragment = template.content.cloneNode(true);

    const nameEl = fragment.querySelector(".fixture__name");
    const leagueEl = fragment.querySelector(".fixture__league");
    const timeEl = fragment.querySelector(".fixture__time");
    const scoreEl = fragment.querySelector(".fixture__score");
    const predictionEl = fragment.querySelector(".fixture__prediction");

    nameEl.textContent = `${event.strHomeTeam} vs ${event.strAwayTeam}`;
    leagueEl.textContent = `Competition: ${event.strLeague || "Unknown"}`;

    const date = new Date(event.dateEvent);
    timeEl.textContent = `Date: ${date.toLocaleDateString()}`;

    const hasScore = event.intHomeScore !== null && event.intHomeScore !== undefined;
    scoreEl.textContent = hasScore
      ? `Final score: ${event.intHomeScore}-${event.intAwayScore}`
      : "Upcoming fixture";

    if (predictionEl) predictionEl.textContent = "";

    fixturesContainer.appendChild(fragment);
  });
};

const loadFixtures = async () => {
  statusText.textContent = "Loading West Ham fixtures...";
  refreshBtn.disabled = true;

  try {
    const [lastRes, nextRes] = await Promise.all([
      fetch(LAST_URL, { cache: "no-store" }),
      fetch(NEXT_URL, { cache: "no-store" }),
    ]);

    const lastData = await lastRes.json();
    const nextData = await nextRes.json();

    const lastMatches = lastData.events || [];
    const nextMatches = nextData.events || [];

    const combined = [...nextMatches, ...lastMatches].slice(0, 10);

    if (!combined.length) {
      statusText.textContent = "No fixtures found.";
      fixturesContainer.innerHTML = "";
      return;
    }

    statusText.textContent = `Showing ${combined.length} West Ham fixtures`;
    renderFixtures(combined);
  } catch (err) {
    console.error(err);
    statusText.textContent = "Failed to load matches.";
    fixturesContainer.innerHTML = "";
  } finally {
    refreshBtn.disabled = false;
  }
};

refreshBtn.addEventListener("click", loadFixtures);
loadFixtures();
