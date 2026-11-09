import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/register-service-worker";
import { ThemeApplier } from "@/components/theme-applier";

// Runs before first paint so a saved dark theme never flashes light.
const THEME_BOOT = `try{var s=JSON.parse(localStorage.getItem("masjidlove.user")||"{}").settings||{};var t=s.theme||"system";var d=t==="dark"||(t==="system"&&matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.dataset.theme=d?"dark":"light";r.classList.toggle("dark",d);r.classList.toggle("light",!d);r.style.colorScheme=d?"dark":"light";var z={large:"1.08",larger:"1.16"}[s.textSize];if(z)r.style.setProperty("--app-zoom",z);if(s.reduceMotion)r.dataset.reduceMotion="true"}catch(e){}`;

export const metadata: Metadata = {
  title: "MasjidLove",
  description: "Events and salah for the masjids around you.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MasjidLove",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="light" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <RegisterServiceWorker />
        <ThemeApplier />
        <div className="app-frame flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
