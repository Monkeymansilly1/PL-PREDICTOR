const API_KEY = "YOUR_API_KEY_HERE";
const TEAM_ID = 563; // West Ham

const fixturesContainer = document.querySelector("#fixtures");
const statusText = document.querySelector("#status");
const refreshBtn = document.querySelector("#refreshBtn");
const tableContainer = document.querySelector("#tableContainer");

const FIXTURE_URL =
  `https://corsproxy.io/?https://api.football-data.org/v4/teams/${TEAM_ID}/matches?status=SCHEDULED`;

const loadFixtures = async () => {
  statusText.textContent = "Loading West Ham fixtures...";
  refreshBtn.disabled = true;

  try {
    const res = await fetch(FIXTURE_URL, {
      headers: { "X-Auth-Token": API_KEY }
    });

    const data = await res.json();

    if (!data.matches || !data.matches.length) {
      statusText.textContent = "No upcoming matches found.";
      fixturesContainer.innerHTML = "";
      return;
    }

    const sorted = data.matches.sort(
      (a, b) => new Date(a.utcDate) - new Date(b.utcDate)
    );

    statusText.textContent = `Showing ${sorted.length} upcoming matches`;

    fixturesContainer.innerHTML = sorted.map(match => `
      <div class="fixture">
        <div>
          <strong>${match.homeTeam.name} vs ${match.awayTeam.name}</strong><br>
          <small>${match.competition.name}</small><br>
          <small>${new Date(match.utcDate).toLocaleString("en-GB")}</small>
        </div>
        <div>
          Upcoming
        </div>
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
    statusText.textContent = "Failed to load fixtures.";
  } finally {
    refreshBtn.disabled = false;
  }
};

/* League Table (TheSportsDB – free) */

const loadLeagueTable = async () => {
  try {
    const res = await fetch(
      "https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4328&s=2025-2026"
    );

    const data = await res.json();

    if (!data.table) {
      tableContainer.innerHTML = "No table data.";
      return;
    }

    const sorted = data.table.sort((a, b) => a.intRank - b.intRank);

    const totalTeams = sorted.length;

    tableContainer.innerHTML = `
      <table class="league-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(team => {
            const pos = parseInt(team.intRank);
            let className = "";

            if (pos === 1) className = "pos-1";
            else if (pos >= 2 && pos <= 4) className = "pos-2";
            else if (pos === 5 || pos === 6) className = "pos-5";
            else if (pos === 7) className = "pos-7";
            else if (pos >= totalTeams - 2) className = "relegation";

            const isWestHam = team.strTeam.includes("West Ham");

            return `
              <tr class="${className} ${isWestHam ? "highlight" : ""}">
                <td>${team.intRank}</td>
                <td style="text-align:left">${team.strTeam}</td>
                <td>${team.intPoints}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;

  } catch (err) {
    console.error(err);
    tableContainer.innerHTML = "Failed to load table.";
  }
};

refreshBtn.addEventListener("click", loadFixtures);

loadFixtures();
loadLeagueTable();
