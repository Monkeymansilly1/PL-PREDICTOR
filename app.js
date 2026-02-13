const fixturesContainer = document.querySelector("#fixtures");
const statusText = document.querySelector("#status");
const template = document.querySelector("#fixtureTemplate");
const refreshBtn = document.querySelector("#refreshBtn");

console.log("WEST HAM UPCOMING VERSION LOADED");

// Your Football-Data API key
const API_KEY = "4d462e0edd4a473b8012c9b246108674";

// West Ham United team ID (Football-Data)
const TEAM_ID = 563;

// Upcoming matches only
const URL =
  `https://corsproxy.io/?https://api.football-data.org/v4/teams/${TEAM_ID}/matches?status=SCHEDULED&limit=50`;

const renderFixtures = (matches) => {
  fixturesContainer.innerHTML = "";

  matches.forEach(match => {
    const fragment = template.content.cloneNode(true);

    // Teams
    fragment.querySelector(".fixture__name").textContent =
      `${match.homeTeam.name} vs ${match.awayTeam.name}`;

    // Competition
    fragment.querySelector(".fixture__league").textContent =
      match.competition.name;

    // Date (converted to local time)
    const date = new Date(match.utcDate);
    fragment.querySelector(".fixture__time").textContent =
      `Kickoff: ${date.toLocaleString()}`;

    // Always upcoming
    fragment.querySelector(".fixture__score").textContent =
      "Upcoming fixture";

    fixturesContainer.appendChild(fragment);
  });
};

const loadFixtures = async () => {
  statusText.textContent = "Loading West Ham upcoming fixtures...";
  refreshBtn.disabled = true;

  try {
    const res = await fetch(URL, {
      headers: {
        "X-Auth-Token": API_KEY
      }
    });

    const data = await res.json();

    if (!data.matches || !data.matches.length) {
      statusText.textContent = "No upcoming matches found.";
      fixturesContainer.innerHTML = "";
      return;
    }

    // Sort soonest first
    const sorted = data.matches.sort(
      (a, b) => new Date(a.utcDate) - new Date(b.utcDate)
    );

    statusText.textContent =
      `Showing ${sorted.length} upcoming West Ham matches`;

    renderFixtures(sorted);

  } catch (err) {
    console.error(err);
    statusText.textContent = "Failed to load matches.";
    fixturesContainer.innerHTML = "";
  }

  refreshBtn.disabled = false;
};

refreshBtn.addEventListener("click", loadFixtures);
loadFixtures();
