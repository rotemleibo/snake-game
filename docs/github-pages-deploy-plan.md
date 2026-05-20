# GitHub Pages Deployment — Plan & Checklist

**Branch:** `feat/github-pages-deploy`
**Base branch:** `main`
**Repo:** `rotemleibo/snake-game`
**Expected URL after deploy:** `https://rotemleibo.github.io/snake-game/`

---

## Goal
Publish the Snake game as a static site on GitHub Pages, auto-deployed on every push to `main`.

---

## Assumptions
- Default branch is `main`.
- Repo name is `snake-game` → Vite `base` must be `/snake-game/`.
- No client-side router is in use → no SPA 404 fallback needed.
- Node 20 is acceptable for the build.

---

## Implementation Checklist

### 1. `vite.config.ts` — set base path
- [x] Add `base: '/snake-game/'` to the Vite config so assets resolve under the repo subpath.
- **Acceptance:** After `npm run build`, `dist/index.html` references assets like `/snake-game/assets/...`. ✅ Verified locally.

### 2. `.github/workflows/deploy.yml` — CI deploy workflow
- [x] Create workflow that:
  - Triggers on `push` to `main` and supports `workflow_dispatch` (manual run).
  - Has `permissions: contents: read, pages: write, id-token: write`.
  - Has `concurrency: group: "pages", cancel-in-progress: false`.
  - **Build job:**
    - `actions/checkout@v4`
    - `actions/setup-node@v4` with Node 20 + npm cache
    - `npm ci`
    - `npm run build`
    - `actions/configure-pages@v5`
    - `actions/upload-pages-artifact@v3` with `path: ./dist`
  - **Deploy job:**
    - Needs build job
    - `environment: name: github-pages, url: ${{ steps.deployment.outputs.page_url }}`
    - `actions/deploy-pages@v4`
- **Acceptance:** Workflow appears under the Actions tab and runs green on push to `main`.

### 3. (Optional, skipped) `public/404.html`
- Not needed — no router. Skip.

---

## Manual Steps (must be done by the user in GitHub UI)
- [ ] **Settings → Pages → Build and deployment → Source:** select **"GitHub Actions"**.
- [ ] Merge PR `feat/github-pages-deploy` → `main`.
- [ ] Watch the **Actions** tab — wait for the `Deploy to GitHub Pages` workflow to succeed.
- [ ] Open `https://rotemleibo.github.io/snake-game/` and verify the game loads and is playable.

---

## Post-Deploy Verification Checklist
- [ ] Page loads at the expected URL (no 404).
- [ ] No 404s in DevTools Network tab for JS/CSS assets (paths should start with `/snake-game/`).
- [ ] Start screen renders.
- [ ] Game starts, snake moves, food spawns, score increments.
- [ ] High score persists across reloads (localStorage).
- [ ] Game over screen shows and "play again" works.

---

## Rollback Plan
- Revert the merge commit on `main` → next push redeploys the previous build.
- Or in GitHub UI: **Settings → Pages → Source: None** to take the site offline.

---

## Files Changed in This Feature
- `vite.config.ts` (modified — add `base`) ✅
- `.github/workflows/deploy.yml` (new) ✅
- `tsconfig.app.json` (modified — exclude test files from production build so `tsc -b` doesn't fail on jest-dom matchers) ✅
- `README.md` (modified — add live URL + Deployment section) ✅
- `docs/github-pages-deploy-plan.md` (this file — new) ✅
