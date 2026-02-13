const fixturesContainer = document.querySelector("#fixtures");
const statusText = document.querySelector("#status");
const template = document.querySelector("#fixtureTemplate");
const refreshBtn = document.querySelector("#refreshBtn");
const tableContainer = document.querySelector("#tableContainer");

const API_KEY = "4d462e0edd4a473b8012c9b246108674"; // Replace with regenerated key

// Free-tier competitions
const competitions = ["PL", "FAC"];

const renderFixtures = (matches) => {
  fixturesContainer.innerHTML = "";

  if (!matches.length) {
    statusText.textContent = "No upcoming matches found.";
    return;
  }

  matches.forEach(match => {
    const fragment = template.content.cloneNode(true);

    fragment.querySelector(".fixture__name").textContent =
      `${match.homeTeam.name} vs ${match.awayTeam.name}`;

    fragment.querySelector(".fixture__league").textContent =
      match.competition.name;

    fragment.querySelector(".fixture__time").textContent =
      `Kickoff: ${new Date(match.utcDate).toLocaleString()}`;

    fragment.querySelector(".fixture__score").textContent =
      "Upcoming fixture";

    fixturesContainer.appendChild(fragment);
  });
};

const loadFixtures = async () => {
  statusText.textContent = "Loading fixtures...";
  refreshBtn.disabled = true;

  try {
    let allMatches = [];

    for (let comp of competitions) {
      const url =
        `https://corsproxy.io/?https://api.football-data.org/v4/competitions/${comp}/matches?status=SCHEDULED`;

      const res = await fetch(url, {
        headers: { "X-Auth-Token": API_KEY }
      });

      const data = await res.json();

      const westHamMatches = (data.matches || []).filter(match =>
        match.homeTeam.name.includes("West Ham") ||
        match.awayTeam.name.includes("West Ham")
      );

      allMatches.push(...westHamMatches);
    }

    const sorted = allMatches.sort(
      (a, b) => new Date(a.utcDate) - new Date(b.utcDate)
    );

    statusText.textContent =
      `Showing ${sorted.length} upcoming West Ham matches`;

    renderFixtures(sorted);

  } catch (err) {
    console.error(err);
    statusText.textContent = "Failed to load fixtures.";
  }

  refreshBtn.disabled = false;
};

const loadLeagueTable = async () => {
  try {
    const res = await fetch(
      "https://corsproxy.io/?https://api.football-data.org/v4/competitions/PL/standings",
      {
        headers: { "X-Auth-Token": API_KEY }
      }
    );

    const data = await res.json();
    const table = data.standings.find(s => s.type === "TOTAL").table;

    const html = `
      <table class="league-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Team</th>
            <th>Pts</th>
          </tr>
        </thead>
        <tbody>
          ${table.map(team => {
            let rowClass = "";

            if (team.position === 1) rowClass = "gold";
            else if (team.position >= 2 && team.position <= 4) rowClass = "blue";
            else if (team.position >= 5 && team.position <= 6) rowClass = "orange";
            else if (team.position === 7) rowClass = "green";
            else if (team.position >= 18) rowClass = "red";

            if (team.team.name.includes("West Ham")) {
              rowClass += " westham";
            }

            return `
              <tr class="${rowClass}">
                <td>${team.position}</td>
                <td style="text-align:left">${team.team.shortName}</td>
                <td>${team.points}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    `;

    tableContainer.innerHTML = html;

  } catch (err) {
    console.error("Table error:", err);
  }
};

refreshBtn.addEventListener("click", loadFixtures);

loadFixtures();
loadLeagueTable();
