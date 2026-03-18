---
name: repair-runner
description: >
  Use this skill whenever the user wants to run, verify, debug, validate, or test software —
  especially for the Automated Repair Assistance project. This skill applies agentic engineering
  patterns to execution and QA: first discover how the project runs, then run the existing tests,
  then make fixes using red/green TDD, then perform manual and browser/API checks as needed.
  This skill is designed to work alongside `gemini-planner`: Gemini plans/specs, Claude builds,
  and this skill runs, tests, verifies, debugs, and documents evidence that the software works.

  Trigger this skill when the user says things like:
  - "run it"
  - "test this"
  - "debug the app"
  - "fix the failing build"
  - "check why docker compose fails"
  - "verify the API"
  - "make sure the frontend works"
  - "run the repo and tell me what's broken"
  - "validate the feature"

---

# Repair Runner — Agentic Run/Test Skill

This skill applies an execution-first workflow inspired by agentic engineering patterns:
- First run the tests
- Use red/green TDD for fixes
- Use subagents for exploration and parallelizable analysis
- Use agentic manual testing to validate behavior beyond the test suite
- Prefer evidence over guesses

This skill is especially tuned for `Automated_repair_assistance`, but it can be used for any software repo.

## Primary goal

Do not just inspect code and speculate.

Actually:
1. detect how the software is supposed to run
2. run the existing tests
3. start the app or services
4. reproduce failures
5. fix them with tests
6. manually verify the result
7. report what was proven to work

---

## Phase 0 — Quick repo reconnaissance

Before changing anything, inspect the repo shape.

Check for:
- `README.md`
- `docker-compose.yml` / `compose.yml`
- `Dockerfile*`
- `package.json`
- `pyproject.toml`
- `requirements.txt`
- `pytest.ini`
- `playwright.config.*`
- `Makefile`
- `.env.example`
- backend/frontend folders
- API route folders
- test directories

Recommended commands:

```bash
pwd
ls -la
find . -maxdepth 3 \( -name "README.md" -o -name "docker-compose.yml" -o -name "compose.yml" -o -name "package.json" -o -name "pyproject.toml" -o -name "requirements.txt" -o -name "pytest.ini" -o -name "playwright.config.*" -o -name "Makefile" -o -name ".env.example" \)
```

Then summarize:
- likely stack
- likely run commands
- likely test commands
- likely env/dependency risks

---

## Phase 1 — First run the tests

Always do this before making changes.

Try in this order:

### Python
```bash
pytest
python -m pytest
uv run pytest
```

### JavaScript / TypeScript
```bash
npm test -- --runInBand
npm run test
pnpm test
yarn test
```

### Monorepo / mixed stack
```bash
make test
docker compose run --rm backend pytest
docker compose run --rm frontend npm test
```

---

## Phase 2 — Run the app before fixing

### Prefer Docker if present
```bash
docker compose up --build
```

### Backend examples
```bash
uvicorn app.main:app --reload
python app.py
python run.py
```

### Frontend examples
```bash
npm install
npm run dev
npm run build
npm run start
```

---

## Phase 3 — Reproduce the bug clearly

Before changing code, write down:
- what command was run
- what happened
- what should have happened
- the smallest reproducible case

---

## Phase 4 — Fix with red/green TDD

Process:
1. write or update a test that demonstrates the failure
2. confirm it fails (red)
3. implement minimal fix
4. confirm it passes (green)

---

## Phase 5 — Agentic manual testing

### API
```bash
curl -i http://127.0.0.1:8000/health
```

### Python quick checks
```bash
python -c "print('sanity')"
```

### Browser
```bash
npx playwright test
```

---

## Phase 6 — Automated Repair Assistance focus

Prioritize:
- Docker services
- API endpoints
- frontend rendering
- file upload/processing

---

## Phase 7 — Reporting

```md
## Repair Runner Report

### Baseline

### Root cause

### Changes made

### Tests

### Manual verification

### Outcome

### Remaining issues
```

---

## Anti-slop rules

Never:
- assume code works
- skip failing test step
- report without evidence

Always:
- reproduce first
- test before fix
- verify after fix

