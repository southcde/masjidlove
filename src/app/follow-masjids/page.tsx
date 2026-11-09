"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ListBox,
  SearchField,
  Typography,
} from "@heroui/react";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { Hydrated } from "@/components/app/hydrated";
import { useUserState } from "@/hooks/use-user-state";
import { formatDistance, listMasjids } from "@/services/masjids";
import {
  IconBookmark,
  IconCheck,
} from "@/components/icons";

function FollowMasjidsScreen() {
  const router = useRouter();
  const [state, update] = useUserState();
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(
    state.followedMasjidIds
  );

  const masjids = useMemo(() => listMasjids(), []);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return masjids;
    return masjids.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.area.toLowerCase().includes(q)
    );
  }, [query, masjids]);

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function follow() {
    update({ followedMasjidIds: selectedIds });
    router.push("/notifications");
  }

  function skip() {
    update({ followedMasjidIds: [] });
    router.push("/notifications");
  }

  return (
    <OnboardingScreen
      back
      backHref="/location"
      step="Step 3 of 3"
      footer={
        <div className="flex flex-col gap-2 border-t border-separator px-0 pb-2 pt-3.5">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            isDisabled={selectedIds.length === 0}
            onPress={follow}
          >
            {selectedIds.length === 0
              ? "Follow a masjid"
              : selectedIds.length === 1
                ? "Follow 1 masjid"
                : `Follow ${selectedIds.length} masjids`}
          </Button>
          <button
            type="button"
            onClick={skip}
            className="mx-auto min-h-[44px] px-2 text-sm text-muted"
          >
            Skip for now
          </button>
        </div>
      }
    >
      <div className="flex flex-1 flex-col gap-5 px-4 pt-2">
        <div className="flex flex-col gap-2 px-2">
          <Typography.Heading level={2}>Pick your masjids</Typography.Heading>
          <Typography.Paragraph className="text-muted">
            Follow as many as you like. Their events and times land on your
            Home.
          </Typography.Paragraph>
        </div>

        <SearchField
          aria-label="Search masjid or area"
          value={query}
          onChange={setQuery}
        >
          <SearchField.Group className="min-h-[52px]">
            <SearchField.SearchIcon
              width={20}
              height={20}
              className="ml-3.5 text-muted"
            />
            <SearchField.Input placeholder="Search masjid or area" />
          </SearchField.Group>
        </SearchField>

        <div className="flex flex-col gap-2.5">
          <Typography.Paragraph
            size="xs"
            className="pl-1 font-medium text-muted"
          >
            Closest to you
          </Typography.Paragraph>

          <ListBox
            aria-label="Masjids"
            selectionMode="multiple"
            selectedKeys={new Set(selectedIds)}
            onSelectionChange={(keys) =>
              setSelectedIds(Array.from(keys as Set<string>))
            }
            className="flex flex-col overflow-hidden rounded-3xl border border-foreground/10 shadow-premium bg-surface"
          >
            {filtered.map((masjid, index) => {
              const isSelected = selectedIds.includes(masjid.id);
              return (
                <ListBox.Item
                  key={masjid.id}
                  id={masjid.id}
                  textValue={masjid.name}
                  onAction={() => toggle(masjid.id)}
                  className={`flex min-h-[52px] items-center gap-3 px-4 py-3.5 outline-none ${
                    isSelected
                      ? "bg-accent-soft"
                      : index > 0
                        ? "border-t border-separator"
                        : ""
                  }`}
                >
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span
                      className={`text-base ${
                        isSelected
                          ? "font-semibold text-accent-soft-foreground"
                          : "font-medium text-foreground"
                      }`}
                    >
                      {masjid.name}
                    </span>
                    <span
                      className={`text-sm ${
                        isSelected
                          ? "text-accent-soft-foreground"
                          : "text-muted"
                      }`}
                    >
                      {masjid.area} · {formatDistance(masjid.distanceKm)}
                      {masjid.eventsThisWeek !== undefined &&
                        ` · ${masjid.eventsThisWeek} event${
                          masjid.eventsThisWeek === 1 ? "" : "s"
                        } this week`}
                    </span>
                  </div>
                  {isSelected ? (
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-[9px] bg-accent text-accent-foreground">
                      <IconCheck size={19} />
                    </span>
                  ) : (
                    <span className="h-7 w-7 flex-none rounded-[9px] border-[1.5px] border-border" />
                  )}
                </ListBox.Item>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-muted">
                No masjids match “{query}”. Try a different name or area.
              </div>
            )}
          </ListBox>
        </div>

        <div className="flex items-start gap-2.5 px-1">
          <span className="mt-0.5 flex-none text-muted">
            <IconBookmark size={18} />
          </span>
          <Typography.Paragraph size="xs" className="text-muted">
            Your first pick becomes your home masjid. You can change it any
            time.
          </Typography.Paragraph>
        </div>
      </div>
    </OnboardingScreen>
  );
}

export default function FollowMasjidsPage() {
  return (
    <Hydrated>
      <FollowMasjidsScreen />
    </Hydrated>
  );
}
