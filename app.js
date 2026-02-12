const fixturesContainer = document.querySelector('#fixtures');
const statusText = document.querySelector('#status');
const template = document.querySelector('#fixtureTemplate');
const refreshButton = document.querySelector('#refreshButton');
const strengthSlider = document.querySelector('#teamStrength');
const strengthValue = document.querySelector('#strengthValue');

const PREM_LEAGUE_ID = '4328';
const API_URL = `https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${PREM_LEAGUE_ID}`;

const normalizeTeamName = (name = '') =>
  name
    .toLowerCase()
    .replace(/\b(fc|afc|city|united|hotspur|wanderers|albion|town)\b/g, '')
    .replace(/[^a-z]/g, '')
    .trim();

const seededNumber = (text) => {
  let hash = 0;
  for (const char of text) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
};

const calcPrediction = (homeTeam, awayTeam, homeAdvantage) => {
  const homePower = seededNumber(normalizeTeamName(homeTeam));
  const awayPower = seededNumber(normalizeTeamName(awayTeam));
  const delta = homePower - awayPower + Number(homeAdvantage);

  const homeWin = 1 / (1 + Math.exp(-3 * delta));
  const awayWin = Math.max(0.08, 1 - homeWin - 0.18);
  const draw = 1 - homeWin - awayWin;

  const homeGoals = Math.max(0, Math.round(1.1 + homeWin * 2 + draw * 0.5));
  const awayGoals = Math.max(0, Math.round(0.8 + awayWin * 2 + draw * 0.4));

  return {
    homeWin: Math.round(homeWin * 100),
    draw: Math.round(draw * 100),
    awayWin: Math.round(awayWin * 100),
    scoreline: `${homeGoals}-${awayGoals}`,
  };
};

const renderFixtures = (events) => {
  fixturesContainer.innerHTML = '';

  for (const event of events) {
    const fragment = template.content.cloneNode(true);
    const nameEl = fragment.querySelector('.fixture__name');
    const timeEl = fragment.querySelector('.fixture__time');
    const probabilityEl = fragment.querySelector('.fixture__win-prob');
    const scoreEl = fragment.querySelector('.fixture__score');

    const homeTeam = event.strHomeTeam;
    const awayTeam = event.strAwayTeam;
    const prediction = calcPrediction(homeTeam, awayTeam, strengthSlider.value);

    nameEl.textContent = `${homeTeam} vs ${awayTeam}`;
    const kickoffDate = new Date(`${event.dateEvent}T${event.strTime || '15:00:00'}Z`);
    timeEl.textContent = `Kickoff: ${kickoffDate.toLocaleString([], {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    probabilityEl.textContent = `Home win ${prediction.homeWin}% · Draw ${prediction.draw}% · Away win ${prediction.awayWin}%`;
    scoreEl.textContent = `Predicted score: ${prediction.scoreline}`;

    fixturesContainer.appendChild(fragment);
  }
};

const loadFixtures = async () => {
  statusText.textContent = 'Loading latest fixtures...';
  refreshButton.disabled = true;

  try {
    const response = await fetch(API_URL, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Request failed with ${response.status}`);
    }

    const payload = await response.json();
    const events = (payload.events || []).slice(0, 10);

    if (!events.length) {
      statusText.textContent = 'No upcoming fixtures found right now.';
      fixturesContainer.innerHTML = '';
      return;
    }

    statusText.textContent = `Showing ${events.length} upcoming fixtures.`;
    renderFixtures(events);
  } catch (error) {
    statusText.textContent = 'Unable to load fixtures right now. Please try again.';
    fixturesContainer.innerHTML = '';
    console.error(error);
  } finally {
    refreshButton.disabled = false;
  }
};

strengthSlider.addEventListener('input', () => {
  strengthValue.textContent = Number(strengthSlider.value).toFixed(2);
  const existingFixtures = [...fixturesContainer.children];
  if (existingFixtures.length > 0) {
    loadFixtures();
  }
});

refreshButton.addEventListener('click', loadFixtures);

strengthValue.textContent = Number(strengthSlider.value).toFixed(2);
loadFixtures();
