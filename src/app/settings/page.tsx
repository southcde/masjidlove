"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  AlertDialog,
  Button,
  Description,
  Label,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
} from "@heroui/react";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { useOnboardingGuard } from "@/hooks/use-onboarding-guard";
import { enablePush, getPosition } from "@/services/native";
import { useUserState } from "@/hooks/use-user-state";
import { defaultUserState, type TextSize, type ThemeChoice } from "@/types";
import { IconChevronRight } from "@/components/icons";

const THEMES: { id: ThemeChoice; label: string; note: string }[] = [
  { id: "system", label: "Auto", note: "Follows your phone" },
  { id: "light", label: "Light", note: "Bright and clear" },
  { id: "dark", label: "Dark", note: "Easy on the eyes" },
];

const SIZES: { id: TextSize; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "large", label: "Large" },
  { id: "larger", label: "Larger" },
];

/** Miniature of each theme so the choice is visual, not just a word. */
function ThemePreview({ id }: { id: ThemeChoice }) {
  const light = (
    <div className="flex h-full flex-1 flex-col gap-1 bg-[#ffffff] p-2">
      <span className="h-1.5 w-8 rounded-full bg-[#16603a]" />
      <span className="h-1.5 w-full rounded-full bg-[#ecefed]" />
      <span className="h-1.5 w-2/3 rounded-full bg-[#ecefed]" />
    </div>
  );
  const dark = (
    <div className="flex h-full flex-1 flex-col gap-1 bg-[#0e1512] p-2">
      <span className="h-1.5 w-8 rounded-full bg-[#3fae75]" />
      <span className="h-1.5 w-full rounded-full bg-[#1f2b26]" />
      <span className="h-1.5 w-2/3 rounded-full bg-[#1f2b26]" />
    </div>
  );
  return (
    <span
      aria-hidden
      className="flex h-[58px] w-full overflow-hidden rounded-xl ring-1 ring-foreground/15"
    >
      {id === "system" ? (
        <>
          {light}
          {dark}
        </>
      ) : id === "light" ? (
        light
      ) : (
        dark
      )}
    </span>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2" aria-label={title}>
      <h2 className="px-0.5 text-[13.5px] font-medium text-muted">{title}</h2>
      <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-surface shadow-premium">
        {children}
      </div>
    </section>
  );
}

export default function SettingsPage() {
  useOnboardingGuard();
  const router = useRouter();
  const [state, update] = useUserState();
  const [clearOpen, setClearOpen] = useState(false);
  const [pushNote, setPushNote] = useState<string | null>(null);
  const { theme, textSize, reduceMotion } = state.settings;

  function setSetting(patch: Partial<typeof state.settings>) {
    update({ settings: { ...state.settings, ...patch } });
  }

  async function togglePush(on: boolean) {
    setPushNote(null);
    if (!on) {
      update({ pushEnabled: false, pushToken: null });
      return;
    }
    const result = await enablePush();
    if (result.status === "granted") {
      update({ pushEnabled: true, pushToken: result.token });
    } else {
      setPushNote(
        result.status === "denied"
          ? "Notifications are blocked. Turn them on in your phone’s settings."
          : "Push notifications work in the mobile app."
      );
    }
  }

  async function askLocation() {
    const position = await getPosition();
    update({ locationDenied: position === null });
  }

  function clearData() {
    update({ ...defaultUserState });
    setClearOpen(false);
    router.push("/");
  }

  return (
    <OnboardingScreen back backHref="/profile">
      <div className="flex flex-1 flex-col gap-6 px-4 pb-8 pt-1">
        <h1 className="px-1 text-[30px] font-bold leading-tight">Settings</h1>

        <section className="flex flex-col gap-2.5" aria-label="Appearance">
          <h2 className="px-0.5 text-[13.5px] font-medium text-muted">Appearance</h2>
          <ToggleButtonGroup
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={new Set([theme])}
            onSelectionChange={(keys) => {
              const key = Array.from(keys as Set<string>)[0];
              if (key) setSetting({ theme: key as ThemeChoice });
            }}
            aria-label="Theme"
            className="grid grid-cols-3 gap-2.5"
          >
            {THEMES.map((option) => (
              <ToggleButton
                key={option.id}
                id={option.id}
                variant="default"
                className="flex h-auto flex-col items-stretch gap-2 rounded-2xl bg-surface p-2.5 text-left shadow-premium ring-2 ring-transparent data-[selected=true]:bg-accent-soft data-[selected=true]:ring-accent"
              >
                <ThemePreview id={option.id} />
                <span className="flex flex-col gap-px px-0.5 pb-0.5">
                  <span className="text-[14px] font-semibold">{option.label}</span>
                  <span className="text-[11.5px] font-normal leading-tight text-muted">
                    {option.note}
                  </span>
                </span>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </section>

        <Group title="Text and motion">
          <div className="flex flex-col gap-2.5 px-4 py-3.5">
            <span className="text-[15.5px] font-medium">Text size</span>
            <ToggleButtonGroup
              selectionMode="single"
              disallowEmptySelection
              selectedKeys={new Set([textSize])}
              onSelectionChange={(keys) => {
                const key = Array.from(keys as Set<string>)[0];
                if (key) setSetting({ textSize: key as TextSize });
              }}
              aria-label="Text size"
              className="grid grid-cols-3 gap-2"
            >
              {SIZES.map((size, i) => (
                <ToggleButton
                  key={size.id}
                  id={size.id}
                  variant="default"
                  className="min-h-[44px] rounded-xl font-medium data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground"
                  style={{ fontSize: 13 + i * 2 }}
                >
                  {size.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>
          <div className="h-px bg-separator" />
          <Switch
            isSelected={reduceMotion}
            onChange={(v) => setSetting({ reduceMotion: v })}
            className="flex p-4"
          >
            <Switch.Content className="flex w-full items-center gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Label className="text-base font-medium">Reduce motion</Label>
                <Description className="text-sm leading-snug">
                  Skip transitions and animations
                </Description>
              </div>
              <Switch.Control className="shrink-0">
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Content>
          </Switch>
        </Group>

        <Group title="Alerts and place">
          <Link
            href="/notifications?from=settings"
            className="flex min-h-[56px] items-center gap-3 px-4 py-2.5 active:bg-default"
          >
            <span className="flex-1 text-[15.5px] font-medium">Notifications</span>
            <IconChevronRight size={16} />
          </Link>
          <div className="h-px bg-separator" />
          <Switch
            isSelected={state.pushEnabled}
            onChange={togglePush}
            className="flex p-4"
          >
            <Switch.Content className="flex w-full items-center gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Label className="text-base font-medium">Push notifications</Label>
                <Description className="text-sm leading-snug">
                  {pushNote ?? "Reminders and salaah time changes on your phone"}
                </Description>
              </div>
              <Switch.Control className="shrink-0">
                <Switch.Thumb />
              </Switch.Control>
            </Switch.Content>
          </Switch>
          <div className="h-px bg-separator" />
          <div className="flex min-h-[56px] items-center gap-3 px-4 py-2.5">
            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="text-[15.5px] font-medium">Location</span>
              <span className="text-[13px] text-muted">
                {state.locationDenied
                  ? "Off — Explore sorts by area"
                  : "On — used while the app is open"}
              </span>
            </span>
            {state.locationDenied && (
              <Button size="sm" variant="outline" onPress={askLocation}>
                Turn on
              </Button>
            )}
          </div>
        </Group>

        <Group title="Your data">
          <button
            type="button"
            onClick={() => setClearOpen(true)}
            className="flex min-h-[56px] w-full items-center px-4 py-2.5 text-left active:bg-default"
          >
            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="text-[15.5px] font-medium text-danger">
                Clear data on this device
              </span>
              <span className="text-[13px] text-muted">
                Removes your profile, RSVPs, bookings and settings
              </span>
            </span>
          </button>
        </Group>

        <p className="px-2 text-center text-[12.5px] text-muted">
          MasjidLove 0.1 · test build — nothing leaves this device
        </p>
      </div>

      <AlertDialog isOpen={clearOpen} onOpenChange={setClearOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Heading>Clear everything?</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                This removes your profile, follows, RSVPs, bookings and giving
                history from this device. It can’t be undone.
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="outline" onPress={() => setClearOpen(false)}>
                  Keep my data
                </Button>
                <Button variant="danger" onPress={clearData}>
                  Clear data
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </OnboardingScreen>
  );
}
