"use client";

import type { ReactNode } from "react";

/** Re-mounts on every navigation, giving each screen a soft fade-in. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
