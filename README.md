# Choose Your Character

A retro arcade-style character select portfolio site. Pick a persona, unlock inside jokes.

**Live site:** [https://obilginozi.github.io/ChooseYourChar/](https://obilginozi.github.io/ChooseYourChar/) (after deployment)

## Tech Stack

- Vite + React + TypeScript
- Tailwind CSS
- Web Audio API (procedural chiptune + SFX)
- PWA (service worker + installable manifest)
- Static deploy to GitHub Pages

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:5173/ChooseYourChar/](http://localhost:5173/ChooseYourChar/) (note the base path).

## Build

```bash
npm run build
npm run preview   # preview production build locally
```

Output goes to `dist/`.

## Character Assets

Full-body pixel portraits live in `public/assets/characters/<id>.png` (32×48 native, exported at 256×384).

To regenerate all portraits after editing the draw routines:

```bash
npm run generate:portraits
```

Source: [`scripts/generate-portraits.mjs`](scripts/generate-portraits.mjs) — each character has mesleki detaylar (scroll, laptop, sarık, bateri, dumbbell, etc.).

To replace with external AI art later, drop new PNGs into the same folder — no code changes needed.

## Fill In Content

Edit `src/data/characters.ts` to replace `TODO:` taglines and jokes with real content.

## Install as PWA (mobile)

On iOS Safari or Android Chrome, use **Add to Home Screen** after visiting the deployed site. The app runs standalone with offline caching via the service worker (production builds only).

## GitHub Pages Deployment

### Prerequisites

> **Public repo required:** GitHub Pages on the free tier only publishes from **public** repositories (unless you have GitHub Pro/Team). If you want the joke content less discoverable, keep the repo public but rely on an unguessable URL — or add a fun client-side passphrase gate later (not real security).

### One-time setup

1. Push this repo to GitHub (`main` branch).
2. Open the repo on GitHub → **Settings** → **Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs automatically on every push to `main`.

### Manual deploy

You can also trigger a deploy from the **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**.

### Live URL

After a successful deploy:

```
https://obilginozi.github.io/ChooseYourChar/
```

The Vite `base` path in [`vite.config.ts`](vite.config.ts) is set to `/ChooseYourChar/` to match the repo name. If you rename the repo, update `base`, the PWA manifest `scope`/`start_url`, and redeploy.

### First push (if the remote is empty)

```bash
git add .
git commit -m "Initial commit: Choose Your Character site"
git push -u origin main
```

Then enable **GitHub Actions** as the Pages source (step 3 above). The first workflow run may need you to approve the `github-pages` environment if GitHub prompts you.
