# Premier League Predictor

A lightweight web app that fetches the latest upcoming Premier League fixtures and generates quick scoreline predictions.

## How to open and use

### 1) Open a terminal in this project folder
If you are not already in the project folder, run:

```bash
cd /workspace/PL-PREDICTOR
```

### 2) Start a local web server

```bash
python3 -m http.server 4173
```

You should see output similar to:

```text
Serving HTTP on 0.0.0.0 port 4173
```

### 3) Open the app in your browser
Go to:

<http://localhost:4173>

### 4) Use the app
- Wait for fixtures to load in the **Upcoming Matches** section.
- Move the **Home advantage intensity** slider to change prediction balance.
- Click **Refresh Fixtures** to pull the latest upcoming matches again.

## If the files are "not here" on GitHub
If your GitHub repo page still shows only the initial commit, your local branch changes are not on `main` yet.

Run these commands from this project folder:

```bash
git remote -v
git branch -vv
git checkout main
git merge work
git push origin main
```

If `main` does not exist locally yet:

```bash
git checkout -b main
git merge work
git push -u origin main
```

After push, refresh your GitHub repo page — you should see:
- `index.html`
- `app.js`
- `styles.css`
- `README.md`

## Important note
Opening `index.html` directly (double-click) may fail to load live fixture data in some browsers due to CORS/security restrictions.
Use the local server method above for best results.

## Troubleshooting
- If Python is missing, install Python 3 and re-run the command.
- If port `4173` is busy, use another port:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.

## Data source and model
- Fixture data source: TheSportsDB public API.
- Predictions are for fun and are generated using deterministic team-name seeding + adjustable home advantage.
