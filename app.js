const fixturesContainer = document.querySelector('#fixtures');
const statusText = document.querySelector('#status');
const template = document.querySelector('#fixtureTemplate');
const refreshBtn = document.querySelector('#refreshBtn');

// Premier League ID
const PL_URL =
  "https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328";

const TEAM_NAME = "West Ham United";

const renderFixtures = (events) => {
  fixturesContainer.innerHTML = "";

  events.forEach((event) => {
    const fragment = template.content.cloneNode(true);

    fragment.querySelector(".fixture__name").textContent =
      `${event.strHomeTeam} vs ${event.strAwayTeam}`;

    fragment.querySelector(".fixture__league").textContent =
      `Competition: ${event.strLeague}`;

    fragment.querySelector(".fixture__time").textContent =
      `Date: ${new Date(event.dateEvent).toLocaleDateString()}`;

    fragment.querySelector(".fixture__score").textContent =
      event.intHomeScore != null
        ? `Final score: ${event.intHomeScore}-${event.intAwayScore}`
        : "Upcoming fixture";

    fixturesContainer.appendChild(fragment);
  });
};

const loadFixtures = async () => {
  statusText.textContent = "Loading West Ham fixtures...";
  refreshBtn.disabled = true;

  try {
    const response = await fetch(PL_URL, { cache: "no-store" });
    const data = await response.json();

    const allEvents = data.events || [];

    // 🔥 Filter only West Ham matches
    const westHamMatches = allEvents.filter(
      (event) =>
        event.strHomeTeam === TEAM_NAME ||
        event.strAwayTeam === TEAM_NAME
    );

    if (!westHamMatches.length) {
      statusText.textContent = "No West Ham fixtures found.";
      fixturesContainer.innerHTML = "";
      return;
    }

    statusText.textContent =
      `Showing ${westHamMatches.length} West Ham fixtures`;

    renderFixtures(westHamMatches);
  } catch (err) {
    console.error(err);
    statusText.textContent = "Failed to load matches.";
  }

  refreshBtn.disabled = false;
};

refreshBtn.addEventListener("click", loadFixtures);
loadFixtures();
