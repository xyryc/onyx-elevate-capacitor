# Onyx Performance Hub — Runbook

## Web Development (Browser)

Start the dev server:
```bash
npm run dev
```
Opens at http://localhost:5173 (or next available port).

Production build + preview:
```bash
npm run build
npm run preview
```

## iOS Simulator (Capacitor)

### First-time setup
```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios --legacy-peer-deps
npx cap init "Onyx Elevate" "com.onyxelevate.app" --web-dir dist
npx cap add ios
```

### Daily development — run on simulator with live reload

**Terminal 1** — start the web dev server:
```bash
npm run dev
```

**Terminal 2** — launch on iOS simulator with live reload:
```bash
npx cap run ios -l --host $(ipconfig getifaddr en0) 
```

If the dev server is on a different port than 3000, add `--port <port>`:
```bash
npx cap run ios -l --host $(ipconfig getifaddr en0) --port 5173
```

### Sync web assets to iOS project (without rebuilding)
```bash
npx cap sync ios
```

### Open in Xcode (for App Store builds, signing, etc.)
```bash
npx cap open ios
```

### Build for production in Xcode
1. Open the project: `npx cap open ios`
2. Select your device or "Any iOS Device"
3. Product → Archive
4. Follow the Xcode Organizer flow to upload to App Store Connect

## Other Commands

| Command | What it does |
|---|---|
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run build:dev` | Vite build in development mode |
| `npm run i18n:generate` | Regenerate translation files |

## Environment Variables

Copy `.env.example` to `.env` and fill in:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key
- `VITE_PAYMENTS_CLIENT_TOKEN` — Stripe publishable key (`pk_test_...` or `pk_live_...`)
