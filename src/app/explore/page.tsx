"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  Alert,
  Button,
  Drawer,
  ListBox,
  ListBoxItem,
  SearchField,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";
import { PatternArt, toneFor } from "@/components/app/pattern-art";
import { MasjidMap } from "@/components/app/masjid-map";
import { MAP_ENABLED } from "@/config/map";
import { useIsDark } from "@/hooks/use-is-dark";
import { TabBar } from "@/components/app/tab-bar";
import { useUserState } from "@/hooks/use-user-state";
import { formatTravel, listMasjids } from "@/services/masjids";
import {
  IconBookmark,
  IconCalendar,
  IconLocate,
} from "@/components/icons";

const FILTERS = ["Has events", "Following", "Jumuʿah"] as const;

export default function ExplorePage() {
  useOnboardingGuard();
  const router = useRouter();
  const [state, update, { toggleSaved }] = useUserState();
  const isDark = useIsDark();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState(false);

  const masjids = useMemo(() => listMasjids(), []);
  const areas = useMemo(
    () => Array.from(new Set(masjids.map((m) => m.area))).sort(),
    [masjids]
  );

  function retryLocation() {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      () => update({ locationDenied: false }),
      () => update({ locationDenied: true }),
      { timeout: 10_000 }
    );
  }
  const filtered = useMemo(() => {
    let list = masjids;
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) || m.area.toLowerCase().includes(q)
      );
    }
    if (filters.has("Has events")) {
      list = list.filter((m) => (m.eventsThisWeek ?? 0) > 0);
    }
    if (filters.has("Following")) {
      list = list.filter((m) => state.followedMasjidIds.includes(m.id));
    }
    // "Jumuʿah" — every masjid in the list holds it; no-op in the mock.
    return list;
  }, [query, filters, masjids, state.followedMasjidIds]);

  const rows = (
    <ListBox
      aria-label="Masjids nearby"
      className="flex flex-col bg-overlay"
    >
      {filtered.map((masjid, index) => {
        const saved = state.savedMasjidIds.includes(masjid.id);
        const published = masjid.todayJamaat !== undefined;
        return (
          <ListBoxItem
            key={masjid.id}
            id={masjid.id}
            textValue={masjid.name}
            isDisabled={!published}
            onAction={() => router.push(`/masjid/${masjid.id}`)}
            className={`flex items-center gap-3 rounded-none px-4 py-3.5 outline-none ${
              index > 0 ? "border-t border-separator" : ""
            } ${!published ? "opacity-55" : "data-[hovered=true]:bg-default"}`}
          >
            <PatternArt
              tone={toneFor(masjid.id)}
              scene="masjid"
              className="h-12 w-12 flex-none rounded-2xl"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-base font-medium text-foreground">
                {masjid.name}
              </span>
              <span className="text-[13px] text-muted">
                {masjid.area} · {formatTravel(masjid)}
                {published && masjid.eventsThisWeek
                  ? ` · ${masjid.eventsThisWeek} event${
                      masjid.eventsThisWeek === 1 ? "" : "s"
                    } this week`
                  : !published
                    ? " · no times published yet"
                    : ""}
              </span>
            </div>
            {published && (
              <button
                type="button"
                aria-label={saved ? `Unsave ${masjid.name}` : `Save ${masjid.name}`}
                aria-pressed={saved}
                onClick={(e) => {
                  e.preventDefault();
                  toggleSaved(masjid.id);
                }}
                className={`flex h-11 w-11 items-center justify-center ${
                  saved ? "text-accent" : "text-muted"
                }`}
              >
                <IconBookmark size={19} />
              </button>
            )}
          </ListBoxItem>
        );
      })}
      {filtered.length === 0 && (
        <div className="px-4 py-6 text-center text-sm text-muted">
          No masjids match “{query}”. Try a different name or area.
        </div>
      )}
    </ListBox>
  );

  return (
    <div className="relative flex flex-1 flex-col">
      {MAP_ENABLED ? (
        <MasjidMap
          masjids={masjids}
          followedIds={state.followedMasjidIds}
          dark={isDark}
          onSelect={(id) => router.push(`/masjid/${id}`)}
        />
      ) : (
        <>
      {/* Map placeholder — GAPS: Mapbox lands with the integrations run.
          Flat blocks read as roads; markers are custom overlays. */}
      <div className="absolute inset-0 bg-snow" aria-hidden>
        <div className="absolute inset-x-0 top-[130px] h-1.5 bg-default" />
        <div className="absolute inset-x-0 top-[310px] h-2 bg-default" />
        <div className="absolute inset-x-0 top-[470px] h-[5px] bg-default" />
        <div className="absolute bottom-0 left-[88px] top-0 w-[5px] bg-default" />
        <div className="absolute bottom-0 left-[232px] top-0 w-2 bg-default" />
        <div className="absolute bottom-0 left-[330px] top-0 w-[5px] bg-default" />
        <span className="absolute left-[150px] top-[350px] text-xs font-medium text-muted">
          Gatesville
        </span>
        <span className="absolute left-8 top-[176px] text-xs font-medium text-muted">
          Rylands
        </span>
        <span className="absolute left-[252px] top-[520px] text-xs font-medium text-muted">
          Athlone
        </span>
      </div>

      {/* Markers — GAPS: custom overlays. Accent pill = followed w/ event
          count; eclipse = others; link dot = you. */}
      <div
        className="absolute left-[158px] top-[392px] flex h-[34px] items-center gap-1 rounded-[11px] border-2 border-white bg-accent px-2.5 text-[12.5px] font-semibold text-accent-foreground shadow-[var(--surface-shadow)]"
        aria-hidden
      >
        <IconCalendar size={14} />
        3
      </div>
      <div
        className="absolute left-[56px] top-[232px] flex h-[30px] items-center gap-1 rounded-[10px] border-2 border-white bg-eclipse px-2 text-xs font-medium text-white"
        aria-hidden
      >
        <IconCalendar size={13} />
        2
      </div>
      <div
        className="absolute left-[268px] top-[300px] flex h-7 w-7 items-center justify-center rounded-[9px] border-2 border-white bg-eclipse text-xs font-semibold text-white"
        aria-hidden
      >
        H
      </div>
      <div
        className="absolute left-[118px] top-[540px] flex h-7 w-7 items-center justify-center rounded-[9px] border-2 border-white bg-eclipse text-xs font-semibold text-white"
        aria-hidden
      >
        Z
      </div>
      <div
        className="absolute left-[202px] top-[186px] h-4 w-4 rounded-full border-[3px] border-white bg-link shadow-[var(--surface-shadow)]"
        aria-hidden
      />

        </>
      )}

      <div className="relative flex flex-1 flex-col">
        <main className="flex flex-1 flex-col px-4 pt-14">
          <SearchField
            aria-label="Search masjid or area"
            value={query}
            onChange={setQuery}
            onFocus={() => setExpanded(true)}
          >
            <SearchField.Group className="min-h-[50px]">
              <SearchField.SearchIcon
                width={20}
                height={20}
                className="ml-4 text-muted"
              />
              <SearchField.Input placeholder="Search masjid or area" />
            </SearchField.Group>
          </SearchField>

          <ToggleButtonGroup
            selectionMode="multiple"
            selectedKeys={filters}
            onSelectionChange={(keys) =>
              setFilters(new Set(Array.from(keys as Set<string>)))
            }
            aria-label="Filters"
            className="mt-2.5 flex gap-2 self-start"
          >
            {FILTERS.map((filter) => (
              <ToggleButton
                key={filter}
                id={filter}
                variant="default"
                className="min-h-[44px] rounded-[11px] px-3 text-[13px] font-medium shadow-[var(--surface-shadow)] data-[selected=true]:bg-accent data-[selected=true]:font-semibold data-[selected=true]:text-accent-foreground"
              >
                {filter}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

          {state.locationDenied && (
            <div className="mt-3 flex flex-col gap-2.5">
              <Alert status="danger">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>Location is off</Alert.Title>
                  <Alert.Description>
                    We can’t sort by walking distance without it — but you can
                    still browse by area.
                  </Alert.Description>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 self-start"
                    onPress={retryLocation}
                  >
                    Try again
                  </Button>
                </Alert.Content>
              </Alert>
              <ToggleButtonGroup
                selectionMode="single"
                selectedKeys={new Set(areas.includes(query) ? [query] : [])}
                onSelectionChange={(keys) =>
                  setQuery(Array.from(keys as Set<string>)[0] ?? "")
                }
                aria-label="Browse by area"
                className="flex flex-wrap gap-2"
              >
                {areas.map((area) => (
                  <ToggleButton
                    key={area}
                    id={area}
                    variant="default"
                    className="min-h-[44px] rounded-[11px] px-3 text-[13px] font-medium shadow-[var(--surface-shadow)] data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                  >
                    {area}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </div>
          )}
        </main>

        <button
          type="button"
          aria-label="Recentre on my location"
          className="absolute bottom-[330px] right-4 flex h-[46px] w-[46px] items-center justify-center rounded-xl border border-border bg-background text-foreground shadow-[var(--surface-shadow)]"
        >
          <IconLocate size={22} />
        </button>

        {/* Peek detent — 284px; expands into the Drawer */}
        <section
          aria-label="Masjids nearby"
          className="sticky bottom-0 flex flex-col rounded-t-2xl border-t border-border bg-overlay shadow-[var(--surface-shadow)]"
        >
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label="Expand masjid list"
            className="flex justify-center pb-1.5 pt-2.5"
          >
            <span className="h-1 w-[38px] rounded-full bg-default" />
          </button>
          <div className="flex items-baseline justify-between px-4 pb-2.5 pt-0.5">
            <span className="text-base font-semibold">
              {filtered.length} masjids nearby
            </span>
            <span className="text-[13px] text-muted">By walk</span>
          </div>
          <div className="h-px bg-separator" />
          <div className="max-h-[196px] overflow-hidden">
            {rows}
          </div>
          <div className="h-[76px] flex-none" aria-hidden />
        </section>
      </div>

      {/* Expanded detent */}
      <Drawer
        isOpen={expanded}
        onOpenChange={setExpanded}
        aria-label="Masjids nearby — expanded"
      >
        <Drawer.Backdrop />
        <Drawer.Content placement="bottom" className="h-[calc(100dvh-92px)] rounded-t-2xl">
          <Drawer.Dialog className="flex h-full flex-col bg-overlay">
            <div className="flex justify-center pb-1.5 pt-2.5">
              <span className="h-1 w-[38px] rounded-full bg-default" />
            </div>
            <div className="px-4 pb-3">
              <SearchField
                aria-label="Search masjid or area"
                value={query}
                onChange={setQuery}
                autoFocus
              >
                <SearchField.Group className="min-h-[50px]">
                  <SearchField.SearchIcon
                    width={20}
                    height={20}
                    className="ml-4 text-muted"
                  />
                  <SearchField.Input placeholder="Search masjid or area" />
                </SearchField.Group>
              </SearchField>
            </div>
            <div className="flex gap-2 px-4 pb-3">
              <span className="rounded-[11px] bg-accent px-3 py-2 text-[13px] font-semibold text-accent-foreground">
                Has events
              </span>
              <span className="rounded-[11px] bg-default px-3 py-2 text-[13px] font-medium text-default-foreground">
                Following
              </span>
              <span className="rounded-[11px] bg-default px-3 py-2 text-[13px] font-medium text-default-foreground">
                Jumuʿah
              </span>
            </div>
            <div className="h-px bg-separator" />
            <div className="flex-1 overflow-y-auto" data-scrollbar="none">
              {rows}
            </div>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer>

      <TabBar active="explore" />
    </div>
  );
}
