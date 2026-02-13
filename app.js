const fixturesContainer = document.querySelector('#fixtures');
const statusText = document.querySelector('#status');
const template = document.querySelector('#fixtureTemplate');
const refreshBtn = document.querySelector('#refreshBtn');

console.log("WEST HAM FILTER VERSION LOADED");

const LEAGUE_URL =
  "https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328";

const norm = (s = "") => s.toLowerCase();

const renderFixtures = (events) => {
  fixturesContainer.innerHTML = "";

  events.forEach(event => {
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
    const res = await fetch(LEAGUE_URL, { cache: "no-store" });
    const data = await res.json();

    const allEvents = data.events || [];

    const westHamMatches = allEvents.filter(event =>
      norm(event.strHomeTeam).includes("west ham") ||
      norm(event.strAwayTeam).includes("west ham")
    );

    if (!westHamMatches.length) {
      statusText.textContent =
        "West Ham not in next 10 PL fixtures returned by API.";
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
