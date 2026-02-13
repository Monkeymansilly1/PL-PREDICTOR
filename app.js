const fixturesContainer = document.querySelector("#fixtures");
const statusText = document.querySelector("#status");
const refreshBtn = document.querySelector("#refreshBtn");
const tableContainer = document.querySelector("#tableContainer");

const API_KEY = "4d462e0edd4a473b8012c9b246108674";
const TEAM_NAME = "West Ham";

// League codes
const COMPETITIONS = [
  "PL",  // Premier League
  "FAC"  // FA Cup
];

const fetchLeagueMatches = async (comp) => {
  const url = `https://corsproxy.io/?https://api.football-data.org/v4/competitions/${comp}/matches?status=SCHEDULED`;
  const res = await fetch(url, {
    headers: { "X-Auth-Token": API_KEY }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.matches || [];
};

const loadFixtures = async () => {
  statusText.textContent = "Loading West Ham fixtures...";
  refreshBtn.disabled = true;
  fixturesContainer.innerHTML = "";

  try {
    let allMatches = [];

    // Fetch from all defined competitions
    await Promise.all(
      COMPETITIONS.map(async (comp) => {
        const matches = await fetchLeagueMatches(comp);
        allMatches.push(...matches);
      })
    );

    // Filter for West Ham
    const westHamMatches = allMatches.filter(
      (m) =>
        m.homeTeam.name.includes(TEAM_NAME) ||
        m.awayTeam.name.includes(TEAM_NAME)
    );

    // Sort by date ascending
    westHamMatches.sort(
      (a, b) => new Date(a.utcDate) - new Date(b.utcDate)
    );

    if (!westHamMatches.length) {
      statusText.textContent = "No upcoming matches found.";
      return;
    }

    statusText.textContent = `Showing ${westHamMatches.length} upcoming matches`;

    fixturesContainer.innerHTML = westHamMatches
      .map((match) => {
        const date = new Date(match.utcDate).toLocaleString("en-GB");
        return `
          <div class="fixture">
            <div>
              <strong>${match.homeTeam.name} vs ${match.awayTeam.name}</strong><br>
              <small>${match.competition.name}</small><br>
              <small>${date}</small>
            </div>
            <div>Upcoming</div>
          </div>
        `;
      })
      .join("");
  } catch (err) {
    console.error(err);
    statusText.textContent = "Failed to load fixtures.";
  } finally {
    refreshBtn.disabled = false;
  }
};

/* League Table from TheSportsDB as before */

const loadLeagueTable = async () => {
  try {
    const res = await fetch(
      "https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4328"
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
          ${sorted
            .map((team) => {
              const pos = parseInt(team.intRank);
              let className = "";

              if (pos === 1) className = "pos-1";
              else if (pos >= 2 && pos <= 4) className = "pos-2";
              else if (pos === 5 || pos === 6) className = "pos-5";
              else if (pos === 7) className = "pos-7";
              else if (pos >= totalTeams - 2) className = "relegation";

              const isWestHam = team.strTeam.includes("West Ham");

              return `
                <tr class="${className} ${
                isWestHam ? "highlight" : ""
              }">
                  <td>${team.intRank}</td>
                  <td style="text-align:left">${team.strTeam}</td>
                  <td>${team.intPoints}</td>
                </tr>
              `;
            })
            .join("")}
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
