# Editing the iConnect Website — No Code Required

All the content that changes year to year lives in **`src/data/*.json`** — plain data files.
Components read from them automatically. You never touch component code to update content.

| File | Controls |
|---|---|
| `announcements.json` | Homepage announcement bar + recruitment banner |
| `team.json` | Core team, year-wise archive at `/team` |
| `gallery.json` | Gallery albums and photos |
| `faqs.json` | Seed Funding FAQ accordion |
| `journey.json` | "Our Journey" timeline on the About page |
| `wings.json` | "How We're Organized" wings grid on the About page |
| `alumni.json` | Alumni Network page |

## Two ways to edit

### Option A — Edit the JSON directly (simplest)
Open the file on GitHub → pencil icon → edit → commit. Vercel redeploys automatically.

### Option B — The visual editor (Decap CMS at `/cms/`)
A form-based editor — no JSON syntax to worry about.

**Locally** (works today, zero setup):
```bash
npx decap-server        # terminal 1
npm run dev             # terminal 2
# open http://localhost:5173/cms/index.html
```

**On the live site** (one-time setup by whoever manages the GitHub org):
1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - Homepage URL: `https://www.iconnectgjust.in`
   - Callback URL: use an OAuth proxy (e.g. deploy [decap-proxy](https://github.com/sveltia/sveltia-cms-auth) to Cloudflare Workers, free)
2. Add `base_url` (the proxy URL) under `backend:` in `public/cms/config.yml`.
3. Editors then log in at `https://www.iconnectgjust.in/cms/index.html` with GitHub accounts that have repo access.

> **Note:** a Supabase-powered admin panel at `/admin` is planned for team + gallery editing
> with image cropping. When it lands, it becomes the preferred tool for those two; the CMS
> remains useful for announcements, FAQs, journey, wings and alumni.

## Common tasks

### Change the announcement bar
`src/data/announcements.json` → edit `announcement.text`; set `"enabled": false` to hide the bar.
Same file controls the recruitment banner (`recruitment.status` → e.g. `"OPEN NOW"`).

### Add next year's team
In `src/data/team.json`, copy the whole `{ "year": "2025-26", ... }` block, paste it above,
change `year` to `"2026-27"`, set `"current": true` (and the old year's `current` to `false`),
then replace names/roles/photos. Groups you leave as empty lists (`[]`) simply don't appear.

### Add photos
1. Put the image file in `src/assets/` (any name, e.g. `konark26-stage.jpg`).
2. Reference it by **filename only** in the JSON (`"img": "konark26-stage.jpg"`).
3. Optionally run `node scripts/optimize-images.mjs` to compress it.

### Add a gallery album
In `src/data/gallery.json`, add to `albums`:
```json
{ "id": "konark-2026", "title": "Konark 2026", "images": [ { "file": "k26-1.jpg", "caption": "Opening ceremony", "height": 420 } ] }
```
Album filter chips appear automatically once there's more than one album.

### Add an alumni profile
In `src/data/alumni.json`, add members under the right batch — the page switches from the
"being mapped" placeholder to profile cards automatically.

## Things that are NOT in JSON (rarely change)

- Forms email: `support@iconnectgjust.in` — hardcoded in `Hometouch.jsx`, `Homefooter.jsx`, `WhyJoin.jsx`.
- Social media URLs — in `HomeFront.jsx` and `Homefooter.jsx`.
- SEO titles/descriptions — in `App.jsx` (per route) and `index.html`.
- PDUIIC page text — in `src/pages/Pduiic.jsx`.

## Deploy

Anything committed to `main` goes live automatically via Vercel. To preview locally first:
`npm run dev` → http://localhost:5173
