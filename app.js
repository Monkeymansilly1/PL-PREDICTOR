const fixturesContainer = document.querySelector("#fixtures");
const statusText = document.querySelector("#status");
const template = document.querySelector("#fixtureTemplate");
const refreshBtn = document.querySelector("#refreshBtn");

const API_KEY = "4d462e0edd4a473b8012c9b246108674";

const competitions = ["PL", "FAC"]; // Premier League + FA Cup

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

    fragment.querySelector(".fixture__score").textContent =
      match.status === "FINISHED"
        ? `Final score: ${match.score.fullTime.home}-${match.score.fullTime.away}`
        : "Upcoming fixture";

    fixturesContainer.appendChild(fragment);
  });
};

const loadFixtures = async () => {
  statusText.textContent = "Loading West Ham fixtures...";
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

      const westHamMatches = data.matches.filter(match =>
        match.homeTeam.name.includes("West Ham") ||
        match.awayTeam.name.includes("West Ham")
      );

      allMatches.push(...westHamMatches);
    }

    if (!allMatches.length) {
      statusText.textContent = "No West Ham fixtures found.";
      fixturesContainer.innerHTML = "";
      return;
    }

    statusText.textContent =
      `Showing ${allMatches.length} West Ham fixtures`;

    renderFixtures(allMatches);

  } catch (err) {
    console.error(err);
    statusText.textContent = "Failed to load matches.";
  }

  refreshBtn.disabled = false;
};

refreshBtn.addEventListener("click", loadFixtures);
loadFixtures();
