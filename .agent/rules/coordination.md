---
trigger: always_on
---

---
name: gemini-planner
description: >
  Use this skill whenever a user wants to build, prototype, or plan any software project — 
  web apps, backend APIs, CLI tools, scripts, data pipelines, or any other kind of software.
  This skill orchestrates a two-phase workflow: Gemini CLI handles planning and architecture 
  (brainstorming, spec writing, risk identification, file/folder structure), then Claude takes 
  Gemini's output and does the actual building. Trigger this skill whenever the user says things 
  like "build me", "let's make", "I want to create", "help me design", "prototype", "plan out", 
  "architect", "scaffold", or describes a piece of software they want to exist. Use it even if 
  they don't say "plan" — if they want software built, this is the skill.
---

# Gemini Planner → Claude Builder

A two-phase skill: Gemini CLI plans, Claude builds.

**Why this split?** Gemini's 1M token context window and Google Search grounding make it excellent for broad architectural exploration, researching libraries, and generating comprehensive specs. Claude then takes that grounded plan and does precise, reliable implementation.

---

## Phase 1: Plan with Gemini CLI

### Check Gemini CLI is available

```bash
which gemini || npx @google/gemini-cli --version
```

If not installed, tell the user:
> "Gemini CLI isn't installed. Run `npm install -g @google/gemini-cli` then authenticate with `gemini` (sign in with Google). Once done, come back and I'll run the planning phase."

### Invoke Gemini in headless mode

Use `gemini -p` for non-interactive, scriptable queries:

```bash
gemini -p "YOUR PROMPT HERE"
```

For structured output (easier to parse):
```bash
gemini -p "YOUR PROMPT" --output-format json
```

### Planning prompt sequence (multi-turn)

Run these as separate `gemini -p` calls, feeding prior output into the next prompt. This is the multi-turn iterative loop.

**Turn 1 — Architecture brainstorm:**
```
You are a senior software architect. The user wants to build: [USER'S REQUEST]

Explore 2-3 architectural approaches. For each, cover:
- Core components and how they interact  
- Tech stack recommendation with brief justification
- Key tradeoffs

Be concrete. No fluff.
```

**Turn 2 — Spec + file structure** (include Turn 1 output in prompt):
```
Based on this architecture: [TURN 1 OUTPUT]

Write a concise technical spec covering:
1. Chosen approach (pick the best one and justify)
2. Tech stack (languages, frameworks, key libraries)
3. File/folder structure (tree format)
4. Core data models or interfaces
5. Main implementation steps in order

Also flag: top 3 risks or gotchas Claude should watch out for when building this.
```

**Turn 3 — Refinement** (optional, use if spec needs clarification):
```
Reviewing this spec: [TURN 2 OUTPUT]

Anything ambiguous or underspecified that would cause implementation problems? 
List concrete gaps and suggest how to fill them.
```

### When to save the plan vs keep in memory

Save to `PLAN.md` when:
- The project has more than ~5 files
- The plan is > 300 words
- The user might want to reference it later
- You'll need to refer back to it during building

Keep in memory only when:
- It's a small script or single-file project
- The plan is short and you can hold it in context

```bash
# Save if needed
cat > PLAN.md << 'EOF'
[GEMINI OUTPUT HERE]
EOF
```

---

## Phase 2: Build with Claude

Read the plan (from memory or `PLAN.md`) and implement it. Follow Gemini's spec closely — it was researched and grounded. Override Gemini's recommendations only if there's a clear technical reason (e.g., a suggested library is deprecated or has a known bug).

### Building principles

1. **Implement in spec order** — Gemini's step ordering is usually right; follow it
2. **Respect the file structure** — Use the tree Gemini generated as your scaffold
3. **Flag deviations** — If you diverge from the plan, say why briefly
4. **Surface Gemini's risks** — Address the flagged gotchas proactively in code

### After building

Tell the user:
- What you built and how it matches the plan
- Any places you deviated from Gemini's spec and why
- Next steps or how to run/test it

---

## Handling edge cases

**Gemini CLI auth fails:**  
> "Gemini CLI needs authentication. Run `gemini` in your terminal and sign in with Google, then try again."

**Gemini returns something off-topic or low quality:**  
Re-prompt with more specificity. If still poor after 2 tries, proceed with Claude-only planning and note that Gemini wasn't helpful for this case.

**User wants to skip planning:**  
If the user says something like "just build it" or "skip the planning", skip Phase 1 entirely and go straight to building. This skill is a default, not a mandate.

**Very small projects (< 50 lines):**  
A single `gemini -p` call for a quick sanity check is fine. Don't over-engineer the planning phase for tiny scripts.