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

| Command                 | What it does                   |
| ----------------------- | ------------------------------ |
| `npm run lint`          | Run ESLint                     |
| `npm run format`        | Format with Prettier           |
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
npm run build
npx cap add android
```

### Daily development — run on emulator/device with live reload

**Terminal 1** — start the web dev server:

```bash
npm run dev
```

**Terminal 2** — launch on Android with live reload:

```bash
npx cap run android -l --host 10.10.28.165 --port 8080
```

> **Note:** Replace `10.10.28.165` with your machine's local IP (`ipconfig` on Windows). The dev server runs on port **8080** by default.

### Sync web assets to Android project (without rebuilding)

```bash
npm run build
npx cap sync android
```

### Open in Android Studio (for Play Store builds, signing, etc.)

```bash
npx cap open android
```

### Build a standalone debug APK (no live reload)

```bash
npm run build
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
