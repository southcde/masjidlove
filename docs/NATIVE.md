# NATIVE.md — Android and iOS builds

The mobile apps are the same Next.js app, packaged with [Capacitor](https://capacitorjs.com).
The web build (Vercel) is unchanged. The admin dashboard stays web-only: open `/admin`
in a desktop browser.

- **App name:** MasjidLove
- **Bundle / application ID:** `com.masjidlove.app` — this cannot change after a store
  release, so confirm it before publishing.
- **Platforms:** Android is set up. iOS is deferred (see the end of this file).

## How it works

`npm run build:native` runs `next build` with `BUILD_TARGET=native`, which switches
`next.config.ts` to a fully static export in `/out` (`output: "export"`,
`trailingSlash: true`, unoptimised images). `cap sync` then copies `/out` into the Android
project. Because of the static export:

- **Detail screens use query parameters**, not path segments: `/events/view?id=…`,
  `/masjid?id=…`, `/learn/course?id=…`, and so on. Build the links with the helpers in
  `src/services/routes.ts`. A path like `/events/[id]` cannot work, because ids made at
  runtime (admin-created events, database rows) cannot be listed at build time.
- **No route handlers** (`src/app/api/**`) ship in the app. When they exist they stay on
  Vercel and the app calls them by URL.
- The service worker is skipped inside the app.

All native calls go through `src/services/native.ts` (haptics, share, location, push,
status bar, splash, deep links). Each works in the browser or reports plainly that it
can't. Do not import `@capacitor/*` anywhere else.

## Build and run (Android)

Needs Android Studio (which brings the SDK and a JDK). One-time: open Android Studio once
so it installs the SDK, then set `ANDROID_HOME` if it isn't picked up.

```bash
npm run native:sync    # static build + copy into android/
npm run native:open    # opens the project in Android Studio; press Run
```

After changing app code, run `npm run native:sync` again. If you change icons or splash
art in `assets/`, run `npm run native:assets`.

For a release build, create a signing key in Android Studio (Build → Generate Signed
Bundle / APK) and upload the `.aab` to the Play Console. Keep the keystore and its
passwords out of the repo.

## Push notifications — needs your Firebase project

The code is in place (Settings → Push notifications, `enablePush()` in `native.ts`), but
Android push needs Firebase:

1. Create a Firebase project and add an Android app with ID `com.masjidlove.app`.
2. Download `google-services.json` and put it in `android/app/`. Do not commit it if the
   repo is public.
3. Store the device token (saved as `pushToken` in the user state) in the database, and
   send messages from a route handler or Supabase function.

Until then the toggle works but registration fails quietly and the setting says push isn't
available.

## Deep links and sharing

The app opens `masjidlove://events/view?id=…` (and any other in-app path). Share links
use `NEXT_PUBLIC_SHARE_BASE_URL` once a public domain exists; until then the native share
sheet carries the `masjidlove://` link and the web build uses the site's own origin. For
links that open the app from a normal `https://` URL, add Android App Links (needs the
domain and a `assetlinks.json` file) — not done yet.

## Not done / needs a decision

- **iOS.** Deferred by choice. It needs a Mac or a cloud Mac build (Codemagic, GitHub
  Actions macOS), an Apple Developer account, APNs credentials, and
  `npx cap add ios`. The native service layer already covers iOS.
- **Icon master.** `assets/icon-only.png` is upscaled from the 512px PWA icon. Supply a
  1024px master and re-run `npm run native:assets`.
- **Mapbox in the app** needs `NEXT_PUBLIC_MAPBOX_TOKEN` at build time.
- **Donations and store policy.** Google Play and the App Store each have rules for
  taking donations in an app. Check them before adding a real payment provider.
- **Not tested on a device or emulator.** The Android project was generated and synced,
  but a machine with Android Studio has to build and run it.
