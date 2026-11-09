// Map configuration lives here, not inline in components (AGENTS.md → Maps).

/** Public Mapbox token. Empty means the map is off and Explore shows a placeholder. */
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export const MAP_ENABLED = MAPBOX_TOKEN.length > 0;

export const MAP_STYLES = {
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
} as const;

/** Cape Town, where the seed masjids are. */
export const MAP_DEFAULT_CENTER: [number, number] = [18.49, -33.945];
export const MAP_DEFAULT_ZOOM = 11.6;

/** Leave room for the bottom sheet and search bar when fitting markers. */
export const MAP_PADDING = { top: 150, bottom: 340, left: 40, right: 40 };
