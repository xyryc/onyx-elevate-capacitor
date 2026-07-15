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

> **Note:** This is a server-rendered app (TanStack Start). `vite build` does **not**
> emit a static `index.html`, so Capacitor's copy/sync step fails unless one exists.
> Always run `npm run build:cap` (builds and writes the required placeholder
> `index.html` into `.output/public`) before any `cap` command. At runtime,
> `cap run -l` loads the real app from the dev server via `server.url`.

### First-time setup

```bash
npm install @capacitor/core @capacitor/cli @capacitor/ios --legacy-peer-deps
npx cap init "Onyx Elevate" "com.onyxelevate.app" --web-dir .output/public
npx cap add ios
```

### Daily development — run on simulator with live reload

**Terminal 1** — start the web dev server:

```bash
npm run dev
```

**Terminal 2** — build the Capacitor web assets, then launch on the iOS simulator with live reload:

```bash
npm run build:cap
npx cap run ios -l --host $(ipconfig getifaddr en0) --port 5173
```

> Re-run `npm run build:cap` whenever you change web code, then `npx cap run ios -l` again.
> The dev server runs on port **5173** by default.

### Sync web assets to iOS project (without rebuilding)

```bash
npm run build:cap
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

> For a production build the WebView must load your deployed backend. Set a
> `server` block in `capacitor.config.ts` pointing `url` at your Cloudflare
> app (e.g. `https://<your-app>.pages.dev`) before archiving.

## Other Commands

| Command                 | What it does                   |
| ----------------------- | ------------------------------ |
| `npm run lint`          | Run ESLint                     |
| `npm run format`        | Format with Prettier           |
| `npm run build:cap`     | Build + write placeholder index.html for Capacitor |
| `npm run build:dev`     | Vite build in development mode |
| `npm run i18n:generate` | Regenerate translation files   |

## Environment Variables

Copy `.env.example` to `.env` and fill in:

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_PUBLISHABLE_KEY` — Supabase anon key
- `VITE_PAYMENTS_CLIENT_TOKEN` — Stripe publishable key (`pk_test_...` or `pk_live_...`)

## Android Emulator / Device (Capacitor)

### First-time setup

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android --legacy-peer-deps
npx cap init "Onyx Elevate" "com.onyxelevate.app" --web-dir .output/public
npm run build:cap
npx cap add android
```

### Daily development — run on emulator/device with live reload

**Terminal 1** — start the web dev server:

```bash
npm run dev
```

**Terminal 2** — build the Capacitor web assets, then launch on Android with live reload:

```bash
npm run build:cap
npx cap run android -l --host $(ipconfig getifaddr en0) --port 5173
```

> Replace the `--host` IP with your machine's local IP. The dev server runs on port **5173** by default.

### Sync web assets to Android project (without rebuilding)

```bash
npm run build:cap
npx cap sync android
```

### Open in Android Studio (for Play Store builds, signing, etc.)

```bash
npx cap open android
```

### Build a standalone debug APK (no live reload)

```bash
npm run build:cap
npx cap build android
```

The APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.

### Build for production (Play Console)

1. Generate a keystore (one-time): `keytool -genkey -v -keystore release.keystore -alias onyx-elevate -keyalg RSA -keysize 2048 -validity 10000`
2. Place the keystore in `android/app/`
3. Create `android/key.properties` with keystore paths and passwords
4. Open in Android Studio: `npx cap open android`
5. Build → Generate Signed Bundle / APK
6. Upload the `.aab` to Play Console

> For a production build the WebView must load your deployed backend. Set a
> `server` block in `capacitor.config.ts` pointing `url` at your Cloudflare
> app before building.
