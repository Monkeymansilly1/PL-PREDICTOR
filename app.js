const API_KEY = "4d462e0edd4a473b8012c9b246108674"

const TEAM_ID = 563 // West Ham

async function loadFixtures(){

const fixturesDiv = document.getElementById("fixtures")

fixturesDiv.innerHTML = "Loading..."

try{

const res = await fetch(
`https://api.football-data.org/v4/teams/${TEAM_ID}/matches?status=SCHEDULED`,
{
headers:{ "X-Auth-Token":API_KEY }
})

const data = await res.json()

fixturesDiv.innerHTML=""

data.matches.slice(0,10).forEach(match=>{

const home = match.homeTeam.name
const away = match.awayTeam.name
const date = new Date(match.utcDate).toLocaleDateString()

fixturesDiv.innerHTML +=
`<p>${home} vs ${away}<br>${date}</p>`

})

}catch{

fixturesDiv.innerHTML="Failed to load fixtures"

}

}

async function loadTable(){

const tbody = document.getElementById("table-body")

const res = await fetch(
"https://api.football-data.org/v4/competitions/PL/standings",
{
headers:{ "X-Auth-Token":API_KEY }
})

const data = await res.json()

const table = data.standings[0].table

tbody.innerHTML=""

table.forEach(team=>{

let className=""

if(team.position===1) className="gold"
else if(team.position<=4) className="blue"
else if(team.position<=6) className="orange"
else if(team.position===7) className="green"
else if(team.position>=18) className="red"

if(team.team.name.includes("West Ham"))
className += " westham"

tbody.innerHTML +=
`<tr class="${className}">
<td>${team.position}</td>
<td>${team.team.name}</td>
<td>${team.points}</td>
</tr>`

})

}

async function runPrediction(){

const prediction = document.getElementById("prediction")

prediction.innerHTML="Simulating season..."

const res = await fetch(
"https://api.football-data.org/v4/competitions/PL/standings",
{
headers:{ "X-Auth-Token":API_KEY }
})

const data = await res.json()

const table = data.standings[0].table

const westHam = table.find(t =>
t.team.name.includes("West Ham")
)

let points = westHam.points
let played = westHam.playedGames
let remaining = 38 - played

for(let i=0;i<remaining;i++){

const r = Math.random()

if(r<0.4) points+=3
else if(r<0.65) points+=1

}

prediction.innerHTML =
`Predicted final points: ${points}`

}

loadFixtures()
loadTable()
