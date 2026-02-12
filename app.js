const fixturesContainer = document.querySelector('#fixtures');
const statusText = document.querySelector('#status');
const template = document.querySelector('#fixtureTemplate');
const refreshBtn = document.querySelector('#refreshBtn');

// West Ham United team ID
const API_URL =
  "https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=133604";

const renderFixtures = (events) => {
  fixturesContainer.innerHTML = "";

  events.forEach(event => {
    const fragment = template.content.cloneNode(true);

    const nameEl = fragment.querySelector(".fixture__name");
    const leagueEl = fragment.querySelector(".fixture__league");
    const timeEl = fragment.querySelector(".fixture__time");
    const scoreEl = fragment.querySelector(".fixture__score");
    const predictionEl = fragment.querySelector(".fixture__prediction");

    nameEl.textContent = `${event.strHomeTeam} vs ${event.strAwayTeam}`;
    leagueEl.textContent = `Competition: ${event.strLeague}`;

    const date = new Date(`${event.dateEvent}T${event.strTime || "15:00:00"}`);
    timeEl.textContent = `Kickoff: ${date.toLocaleString()}`;

    scoreEl.textContent = "Upcoming Fixture";
    predictionEl.textContent = "";

    fixturesContainer.appendChild(fragment);
  });
};

const loadFixtures = async () => {
  statusText.textContent = "Loading West Ham fixtures...";
  refreshBtn.disabled = true;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    if (!data.events) {
      statusText.textContent = "No upcoming fixtures found.";
      return;
    }

    // 🔥 Extra safety filter — must contain West Ham
    const westHamGames = data.events.filter(event =>
      event.strHomeTeam === "West Ham United" ||
      event.strAwayTeam === "West Ham United"
    );

    statusText.textContent =
      `Showing ${westHamGames.length} upcoming West Ham fixtures`;

    renderFixtures(westHamGames);

  } catch (err) {
    statusText.textContent = "Failed to load matches.";
    console.error(err);
  }

  refreshBtn.disabled = false;
};

refreshBtn.addEventListener("click", loadFixtures);
loadFixtures();
