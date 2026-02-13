const fixturesContainer = document.querySelector("#fixtures");
const statusText = document.querySelector("#status");
const template = document.querySelector("#fixtureTemplate");
const refreshBtn = document.querySelector("#refreshBtn");

console.log("FOOTBALL DATA VERSION LOADED");

// Your API key
const API_KEY = "4d462e0edd4a473b8012c9b246108674";

// Premier League competition code
const URL =
  "https://corsproxy.io/?https://api.football-data.org/v4/competitions/PL/matches?status=SCHEDULED";

const renderFixtures = (matches) => {
  fixturesContainer.innerHTML = "";

  matches.forEach(match => {
    const fragment = template.content.cloneNode(true);

    fragment.querySelector(".fixture__name").textContent =
      `${match.homeTeam.name} vs ${match.awayTeam.name}`;

    fragment.querySelector(".fixture__league").textContent =
      `Premier League`;

    fragment.querySelector(".fixture__time").textContent =
      `Date: ${new Date(match.utcDate).toLocaleDateString()}`;

    fragment.querySelector(".fixture__score").textContent =
      "Upcoming fixture";

    fixturesContainer.appendChild(fragment);
  });
};

const loadFixtures = async () => {
  statusText.textContent = "Loading West Ham fixtures...";
  refreshBtn.disabled = true;

  try {
    const res = await fetch(URL, {
      headers: {
        "X-Auth-Token": API_KEY
      }
    });

    const data = await res.json();

    const westHamMatches = data.matches.filter(match =>
      match.homeTeam.name.includes("West Ham") ||
      match.awayTeam.name.includes("West Ham")
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
