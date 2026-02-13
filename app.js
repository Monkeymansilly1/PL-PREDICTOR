const fixturesContainer = document.querySelector("#fixtures");
const statusText = document.querySelector("#status");
const template = document.querySelector("#fixtureTemplate");
const refreshBtn = document.querySelector("#refreshBtn");

console.log("WEST HAM TEAM ENDPOINT LOADED");

const API_KEY = "4d462e0edd4a473b8012c9b246108674";

// West Ham team ID on Football-Data
const TEAM_ID = 563;

const URL =
  `https://corsproxy.io/?https://api.football-data.org/v4/teams/${TEAM_ID}/matches`;

const renderFixtures = (matches) => {
  fixturesContainer.innerHTML = "";

  matches.forEach(match => {
    const fragment = template.content.cloneNode(true);

    fragment.querySelector(".fixture__name").textContent =
      `${match.homeTeam.name} vs ${match.awayTeam.name}`;

    fragment.querySelector(".fixture__league").textContent =
      match.competition.name;

    fragment.querySelector(".fixture__time").textContent =
      `Date: ${new Date(match.utcDate).toLocaleString()}`;

    const scoreEl = fragment.querySelector(".fixture__score");

    if (match.status === "FINISHED") {
      scoreEl.textContent =
        `Final score: ${match.score.fullTime.home}-${match.score.fullTime.away}`;
    } else {
      scoreEl.textContent = "Upcoming fixture";
    }

    fixturesContainer.appendChild(fragment);
  });
};

const loadFixtures = async () => {
  statusText.textContent = "Loading West Ham matches...";
  refreshBtn.disabled = true;

  try {
    const res = await fetch(URL, {
      headers: {
        "X-Auth-Token": API_KEY
      }
    });

    const data = await res.json();

    if (!data.matches || !data.matches.length) {
      statusText.textContent = "No matches found.";
      fixturesContainer.innerHTML = "";
      return;
    }

    // Sort by newest first
    const sorted = data.matches.sort(
      (a, b) => new Date(b.utcDate) - new Date(a.utcDate)
    );

    statusText.textContent =
      `Showing ${sorted.length} West Ham matches`;

    renderFixtures(sorted.slice(0, 15));

  } catch (err) {
    console.error(err);
    statusText.textContent = "Failed to load matches.";
  }

  refreshBtn.disabled = false;
};

refreshBtn.addEventListener("click", loadFixtures);
loadFixtures();
