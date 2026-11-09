"use client";

import { useEffect, useRef } from "react";
import type { Map as MapboxMap, Marker } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  MAP_DEFAULT_CENTER,
  MAP_DEFAULT_ZOOM,
  MAP_PADDING,
  MAP_STYLES,
  MAPBOX_TOKEN,
} from "@/config/map";
import type { Masjid } from "@/types";

type Props = {
  masjids: Masjid[];
  followedIds: string[];
  dark: boolean;
  onSelect: (id: string) => void;
};

/**
 * The only place that touches the Mapbox SDK. Loaded dynamically so
 * mapbox-gl never enters the server bundle. The camera is set once from the
 * markers; later renders only change the style or the marker set.
 */
export function MasjidMap({ masjids, followedIds, dark, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapboxMap | null>(null);
  const markers = useRef<Marker[]>([]);
  const onSelectRef = useRef(onSelect);
  const fitted = useRef(false);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled || !container.current) return;
      mapboxgl.accessToken = MAPBOX_TOKEN;
      mapRef.current = new mapboxgl.Map({
        container: container.current,
        style: dark ? MAP_STYLES.dark : MAP_STYLES.light,
        center: MAP_DEFAULT_CENTER,
        zoom: MAP_DEFAULT_ZOOM,
        attributionControl: false,
      });
      mapRef.current.addControl(
        new mapboxgl.AttributionControl({ compact: true }),
        "top-left"
      );
    })();
    return () => {
      cancelled = true;
      markers.current.forEach((m) => m.remove());
      markers.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
      fitted.current = false;
    };
    // The map is created once; style and markers are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Follow the app theme.
  useEffect(() => {
    mapRef.current?.setStyle(dark ? MAP_STYLES.dark : MAP_STYLES.light);
  }, [dark]);

  // Draw markers whenever the data changes (and once the map exists).
  useEffect(() => {
    let cancelled = false;
    const draw = async () => {
      const map = mapRef.current;
      if (!map || cancelled) return;
      const mapboxgl = (await import("mapbox-gl")).default;
      markers.current.forEach((m) => m.remove());
      markers.current = masjids.map((masjid) => {
        const followed = followedIds.includes(masjid.id);
        const el = document.createElement("button");
        el.type = "button";
        el.setAttribute("aria-label", `${masjid.name}, ${masjid.area}`);
        el.className = followed
          ? "flex h-[34px] items-center gap-1 rounded-[11px] border-2 border-white bg-accent px-2.5 text-[12.5px] font-semibold text-accent-foreground shadow-lift"
          : "flex h-8 w-8 items-center justify-center rounded-[10px] border-2 border-white bg-eclipse text-[12.5px] font-semibold text-white shadow-lift";
        el.textContent = followed
          ? `★ ${masjid.eventsThisWeek ?? 0}`
          : masjid.name[0];
        el.addEventListener("click", () => onSelectRef.current(masjid.id));
        return new mapboxgl.Marker({ element: el })
          .setLngLat([masjid.lng, masjid.lat])
          .addTo(map);
      });
      if (!fitted.current && masjids.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        masjids.forEach((m) => bounds.extend([m.lng, m.lat]));
        map.fitBounds(bounds, { padding: MAP_PADDING, maxZoom: 14, duration: 0 });
        fitted.current = true;
      }
    };
    const map = mapRef.current;
    if (map?.loaded()) {
      void draw();
    } else {
      // Map still starting: poll briefly until it exists, then draw.
      const timer = window.setInterval(() => {
        if (mapRef.current?.loaded()) {
          window.clearInterval(timer);
          void draw();
        }
      }, 150);
      return () => {
        cancelled = true;
        window.clearInterval(timer);
      };
    }
    return () => {
      cancelled = true;
    };
  }, [masjids, followedIds]);

  return <div ref={container} className="absolute inset-0" aria-label="Map of masjids" />;
}
