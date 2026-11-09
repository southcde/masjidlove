import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { PushNotifications } from "@capacitor/push-notifications";
import { Share } from "@capacitor/share";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";

// The one place the app talks to native device features. Every function works
// in the browser too (or says plainly that it can't), so screens never need to
// know which platform they're on. Plain functions: no React in this layer.

/** Custom URL scheme registered in AndroidManifest.xml. */
const APP_SCHEME = "masjidlove://";

/** Public website origin used for share links. Empty until a domain exists. */
const SHARE_BASE_URL = process.env.NEXT_PUBLIC_SHARE_BASE_URL ?? "";

export const isNative = () => Capacitor.isNativePlatform();

// ---- Haptics ---------------------------------------------------------------

export async function haptic(kind: "tap" | "success" | "warning" = "tap") {
  if (!isNative()) return;
  try {
    if (kind === "tap") await Haptics.impact({ style: ImpactStyle.Light });
    else
      await Haptics.notification({
        type: kind === "success" ? NotificationType.Success : NotificationType.Warning,
      });
  } catch {
    // Haptics are a nicety; never let them break an action.
  }
}

// ---- Share -----------------------------------------------------------------

export type ShareResult = "shared" | "copied" | "unsupported";

/** Share a screen. `path` is an in-app path such as /events/view?id=x. */
export async function shareScreen(opts: {
  title: string;
  text: string;
  path: string;
}): Promise<ShareResult> {
  const base = SHARE_BASE_URL || (isNative() ? "" : window.location.origin);
  const link = base ? `${base}${opts.path}` : `${APP_SCHEME}${opts.path.replace(/^\//, "")}`;
  try {
    if (isNative()) {
      await Share.share({ title: opts.title, text: `${opts.text}\n${link}`, dialogTitle: "Share" });
      return "shared";
    }
    if (navigator.share) {
      await navigator.share({ title: opts.title, text: opts.text, url: link });
      return "shared";
    }
    await navigator.clipboard.writeText(`${opts.text}\n${link}`);
    return "copied";
  } catch (error) {
    // Dismissing the share sheet rejects; that's not a failure.
    if (error instanceof DOMException && error.name === "AbortError") return "shared";
    return "unsupported";
  }
}

// ---- Location --------------------------------------------------------------

export type Position = { lat: number; lng: number };

/** One-shot position. Returns null if the user declines or it's unavailable. */
export async function getPosition(): Promise<Position | null> {
  try {
    if (isNative()) {
      const permission = await Geolocation.requestPermissions({ permissions: ["location"] });
      if (permission.location !== "granted") return null;
      const p = await Geolocation.getCurrentPosition({ timeout: 10_000 });
      return { lat: p.coords.latitude, lng: p.coords.longitude };
    }
    if (!("geolocation" in navigator)) return null;
    return await new Promise<Position | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve(null),
        { timeout: 10_000 }
      );
    });
  } catch {
    return null;
  }
}

// ---- Push notifications ----------------------------------------------------

export type PushResult =
  | { status: "granted"; token: string }
  | { status: "denied" | "unavailable" };

/**
 * Ask for permission and register for push. Needs the native app and a
 * Firebase project (google-services.json) — see docs/NATIVE.md. The token is
 * returned so it can be stored once the backend exists.
 */
export async function enablePush(): Promise<PushResult> {
  if (!isNative()) return { status: "unavailable" };
  try {
    const permission = await PushNotifications.requestPermissions();
    if (permission.receive !== "granted") return { status: "denied" };
    return await new Promise<PushResult>((resolve) => {
      const timer = setTimeout(() => resolve({ status: "unavailable" }), 10_000);
      void PushNotifications.addListener("registration", (token) => {
        clearTimeout(timer);
        resolve({ status: "granted", token: token.value });
      });
      void PushNotifications.addListener("registrationError", () => {
        clearTimeout(timer);
        resolve({ status: "unavailable" });
      });
      void PushNotifications.register();
    });
  } catch {
    return { status: "unavailable" };
  }
}

// ---- App shell -------------------------------------------------------------

export async function setStatusBar(dark: boolean) {
  if (!isNative()) return;
  try {
    await StatusBar.setStyle({ style: dark ? Style.Dark : Style.Light });
    await StatusBar.setBackgroundColor({ color: dark ? "#0e1512" : "#ffffff" });
  } catch {
    // Unsupported on some platforms; ignore.
  }
}

export async function hideSplash() {
  if (!isNative()) return;
  try {
    await SplashScreen.hide({ fadeOutDuration: 250 });
  } catch {
    // ignore
  }
}

/** Turn masjidlove://events/view?id=x into /events/view?id=x. */
export function pathFromDeepLink(url: string): string | null {
  if (url.startsWith(APP_SCHEME)) return `/${url.slice(APP_SCHEME.length)}`;
  try {
    const parsed = new URL(url);
    if (SHARE_BASE_URL && parsed.origin === SHARE_BASE_URL) {
      return `${parsed.pathname}${parsed.search}`;
    }
  } catch {
    // not a URL
  }
  return null;
}

/** Listen for links that open the app. Returns an unsubscribe function. */
export function onDeepLink(handler: (path: string) => void): () => void {
  if (!isNative()) return () => {};
  let remove: (() => void) | undefined;
  void App.addListener("appUrlOpen", (event) => {
    const path = pathFromDeepLink(event.url);
    if (path) handler(path);
  }).then((handle) => {
    remove = () => void handle.remove();
  });
  return () => remove?.();
}
