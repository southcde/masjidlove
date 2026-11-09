"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Time } from "@internationalized/date";
import {
  Alert,
  AlertDialog,
  Button,
  Checkbox,
  Chip,
  CloseButton,
  Description,
  Label,
  Switch,
  TimeField,
} from "@heroui/react";
import { Hydrated } from "@/components/app/hydrated";
import { useUserState } from "@/hooks/use-user-state";
import { getMasjid } from "@/services/masjids";
import { toMinutes } from "@/services/jamaat";
import type { PrayerId } from "@/types";

const ROWS: { id: PrayerId; label: string }[] = [
  { id: "fajr", label: "Fajr" },
  { id: "dhuhr", label: "Dhuhr" },
  { id: "asr", label: "Asr" },
  { id: "maghrib", label: "Maghrib" },
  { id: "isha", label: "Isha" },
  { id: "jumuah", label: "Jumuʿah" },
];

const DEFAULT_JUMUAH = "12:45";
const FOLLOWERS = 1240;

function toTime(value: string) {
  const [h, m] = value.split(":").map(Number);
  return new Time(h, m);
}

function toValue(t: Time) {
  return `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;
}

function AdminTimesScreen() {
  const router = useRouter();
  const [state, update] = useUserState();
  const masjid = getMasjid(state.followedMasjidIds[0] ?? "masjidul-quds");

  const base: Record<PrayerId, string> = {
    fajr: state.jamaatEdits.fajr ?? masjid?.todayJamaat?.fajr ?? "05:42",
    dhuhr: state.jamaatEdits.dhuhr ?? masjid?.todayJamaat?.dhuhr ?? "13:15",
    asr: state.jamaatEdits.asr ?? masjid?.todayJamaat?.asr ?? "16:30",
    maghrib: state.jamaatEdits.maghrib ?? masjid?.todayJamaat?.maghrib ?? "18:22",
    isha: state.jamaatEdits.isha ?? masjid?.todayJamaat?.isha ?? "19:40",
    jumuah: state.jamaatEdits.jumuah ?? DEFAULT_JUMUAH,
  };

  const [draft, setDraft] = useState<Record<PrayerId, string>>(base);
  const [autoMaghrib, setAutoMaghrib] = useState(false);
  const [wholeWeek, setWholeWeek] = useState(state.jamaatEditsWholeWeek);
  const [discardOpen, setDiscardOpen] = useState(false);

  const changed = ROWS.filter((r) => draft[r.id] !== base[r.id]);

  function publish() {
    update({
      // Only what actually moved, so untouched times keep their own data.
      jamaatEdits: {
        ...state.jamaatEdits,
        ...Object.fromEntries(changed.map((r) => [r.id, draft[r.id]])),
      },
      jamaatEditsWholeWeek: wholeWeek,
    });
    router.push(`/masjid/${masjid?.id ?? "masjidul-quds"}/jamaat`);
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex h-11 flex-none items-center justify-between px-4">
        <CloseButton
          aria-label="Close"
          onPress={() => (changed.length ? setDiscardOpen(true) : router.push("/admin"))}
        />
        {changed.length > 0 && (
          <button
            type="button"
            onClick={() => setDiscardOpen(true)}
            className="min-h-[44px] px-2 text-[15px] font-medium text-link"
          >
            Discard
          </button>
        )}
      </header>

      <main className="flex flex-1 flex-col gap-5 px-4 pb-4 pt-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em]">
            This week’s times
          </h1>
          <p className="text-[13px] text-muted">{masjid?.name}</p>
        </div>

        {changed.length > 0 && (
          <Alert status="warning">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Description>
                {changed.length} unsaved change{changed.length === 1 ? "" : "s"}.
                Nobody is notified until you publish.
              </Alert.Description>
            </Alert.Content>
          </Alert>
        )}

        <div className="flex flex-col gap-4">
          {ROWS.map(({ id, label }) => {
            const delta = toMinutes(draft[id]) - toMinutes(base[id]);
            const isChanged = delta !== 0;
            const disabled = id === "maghrib" && autoMaghrib;
            return (
              <div key={id} className="flex flex-col gap-1.5">
                <TimeField
                  aria-label={label}
                  hourCycle={24}
                  value={toTime(draft[id])}
                  isDisabled={disabled}
                  onChange={(v) => v && setDraft((d) => ({ ...d, [id]: toValue(v as Time) }))}
                >
                  <Label>{label}</Label>
                  <TimeField.Group fullWidth>
                    <TimeField.Input>
                      {(segment) => <TimeField.Segment segment={segment} />}
                    </TimeField.Input>
                    {isChanged && (
                      <TimeField.Suffix>
                        <Chip
                          variant="secondary"
                          className="bg-warning-soft text-[12.5px] font-semibold text-warning-soft-foreground"
                        >
                          {delta > 0 ? "+" : "−"}
                          {Math.abs(delta)} min
                        </Chip>
                      </TimeField.Suffix>
                    )}
                  </TimeField.Group>
                  {isChanged && <Description>Was {base[id]}.</Description>}
                  {disabled && <Description>follows sunset</Description>}
                  {id === "dhuhr" && !isChanged && (
                    <Description>Friday Jumuʿah is set separately.</Description>
                  )}
                </TimeField>
                {id === "maghrib" && (
                  <Switch isSelected={autoMaghrib} onChange={setAutoMaghrib} className="flex items-center gap-3">
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                    <Switch.Content>
                      <Label className="text-[14px]">Set Maghrib automatically</Label>
                    </Switch.Content>
                  </Switch>
                )}
              </div>
            );
          })}
        </div>

        <Checkbox isSelected={wholeWeek} onChange={setWholeWeek} className="flex items-center gap-3">
          <Checkbox.Control>
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Content>
            <Label>Apply to the rest of this week</Label>
          </Checkbox.Content>
        </Checkbox>
      </main>

      <footer className="sticky bottom-0 flex flex-col items-center gap-2 bg-background px-4 pb-8 pt-2">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          isDisabled={changed.length === 0}
          onPress={publish}
        >
          {changed.length
            ? `Publish ${changed.length} change${changed.length === 1 ? "" : "s"}`
            : "No changes to publish"}
        </Button>
        {changed.length > 0 && (
          <span className="text-[13px] text-muted">
            {FOLLOWERS.toLocaleString("en-ZA")} followers will be notified.
          </span>
        )}
      </footer>

      <AlertDialog isOpen={discardOpen} onOpenChange={setDiscardOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Heading>Discard changes?</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                Your {changed.length} unpublished change
                {changed.length === 1 ? "" : "s"} will be lost.
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="outline" onPress={() => setDiscardOpen(false)}>
                  Keep editing
                </Button>
                <Button variant="danger" onPress={() => router.push("/admin")}>
                  Discard
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </div>
  );
}

export default function AdminTimesPage() {
  return (
    <Hydrated>
      <AdminTimesScreen />
    </Hydrated>
  );
}
