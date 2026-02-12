const fixturesContainer = document.querySelector("#fixtures");
const statusText = document.querySelector("#status");
const template = document.querySelector("#fixtureTemplate");
const refreshBtn = document.querySelector("#refreshBtn");

// Cache-bust marker so you can confirm the live site updated
console.log("WEST HAM APP LOADED v3");

const TEAM_QUERY_URL =
  "https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=West%20Ham%20United";

const norm = (s = "") => s.toLowerCase().trim();
const isWestHamGame = (event) => {
  const home = norm(event?.strHomeTeam);
  const away = norm(event?.strAwayTeam);
  return home.includes("west ham") || away.includes("west ham");
};

const renderFixtures = (events) => {
  fixturesContainer.innerHTML = "";

  events.forEach((event) => {
    const fragment = template.content.cloneNode(true);

    fragment.querySelector(".fixture__name").textContent =
      `${event.strHomeTeam} vs ${event.strAwayTeam}`;

    fragment.querySelector(".fixture__league").textContent =
      `Competition: ${event.strLeague || "Unknown"}`;

    const date = event.dateEvent ? new Date(event.dateEvent) : null;
    fragment.querySelector(".fixture__time").textContent =
      `Date: ${date ? date.toLocaleDateString() : "Unknown"}`;

    const scoreEl = fragment.querySelector(".fixture__score");
    const hasScore = event.intHomeScore !== null && event.intHomeScore !== undefined;

    scoreEl.textContent = hasScore
      ? `Final score: ${event.intHomeScore}-${event.intAwayScore}`
      : "Upcoming fixture";

    const predEl = fragment.querySelector(".fixture__prediction");
    if (predEl) predEl.textContent = "";

    fixturesContainer.appendChild(fragment);
  });
};

const getWestHamTeamId = async () => {
  const res = await fetch(TEAM_QUERY_URL, { cache: "no-store" });
  const data = await res.json();
  const team = data?.teams?.[0];
  return team?.idTeam || null;
};

const loadFixtures = async () => {
  statusText.textContent = "Loading West Ham fixtures...";
  refreshBtn.disabled = true;

  try {
    const teamId = await getWestHamTeamId();
    if (!teamId) {
      statusText.textContent = "Couldn’t find West Ham team ID from API.";
      fixturesContainer.innerHTML = "";
      return;
    }

    const LAST_URL = `https://www.thesportsdb.com/api/v1/json/3/eventslast.php?id=${teamId}`;
    const NEXT_URL = `https://www.thesportsdb.com/api/v1/json/3/eventsnext.php?id=${teamId}`;

    const [lastRes, nextRes] = await Promise.all([
      fetch(LAST_URL, { cache: "no-store" }),
      fetch(NEXT_URL, { cache: "no-store" }),
    ]);

    const lastData = await lastRes.json();
    const nextData = await nextRes.json();

    const lastMatches = (lastData?.events || []).filter(isWestHamGame);
    const nextMatches = (nextData?.events || []).filter(isWestHamGame);

    const combined = [...nextMatches, ...lastMatches].slice(0, 10);

    if (!combined.length) {
      statusText.textContent = "No West Ham fixtures returned by TheSportsDB right now.";
      fixturesContainer.innerHTML = "";
      return;
    }

    statusText.textContent = `Showing ${combined.length} West Ham fixtures`;
    renderFixtures(combined);
  } catch (err) {
    console.error(err);
    statusText.textContent = "Failed to load matches.";
    fixturesContainer.innerHTML = "";
  } finally {
    refreshBtn.disabled = false;
  }
};

refreshBtn.addEventListener("click", loadFixtures);
loadFixtures();
