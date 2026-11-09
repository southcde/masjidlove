"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Radio, RadioGroup, Typography } from "@heroui/react";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { useUserState } from "@/hooks/use-user-state";
import {
  IconAdmin,
  IconCheck,
  IconPeople,
  IconQuestion,
} from "@/components/icons";
import type { OnboardingRole } from "@/types";

function RoleCard({
  value,
  icon,
  title,
  description,
}: {
  value: OnboardingRole;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Radio value={value}>
      <Radio.Content className="flex-1 cursor-pointer rounded-3xl border border-foreground/10 shadow-premium bg-background p-4 pt-5 outline-none data-[selected=true]:border-2 data-[selected=true]:border-accent data-[selected=true]:bg-accent-soft">
        {({ isSelected }: { isSelected: boolean }) => (
          <div className="relative flex flex-col items-center gap-3 text-center">
            {isSelected && (
              <span className="absolute -top-1 right-0 flex h-6 w-6 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <IconCheck size={17} />
              </span>
            )}
            <span
              className={
                isSelected ? "text-accent-soft-foreground" : "text-muted"
              }
            >
              {icon}
            </span>
            <span
              className={`text-lg font-semibold ${
                isSelected ? "text-accent-soft-foreground" : "text-foreground"
              }`}
            >
              {title}
            </span>
            <span
              className={`text-sm leading-snug ${
                isSelected ? "text-accent-soft-foreground" : "text-muted"
              }`}
            >
              {description}
            </span>
          </div>
        )}
      </Radio.Content>
    </Radio>
  );
}

export default function RolePage() {
  const router = useRouter();
  const [, update] = useUserState();
  const [role, setRole] = useState<OnboardingRole | null>(null);

  function proceed() {
    if (!role) return;
    update({ role });
    router.push("/profile-setup");
  }

  return (
    <OnboardingScreen
      footer={
        <Button
          variant="primary"
          size="lg"
          fullWidth
          isDisabled={!role}
          onPress={proceed}
        >
          Get started
        </Button>
      }
    >
      <div className="flex flex-1 flex-col gap-10 px-6 pt-6">
        <div className="flex flex-col gap-3">
          <Typography.Heading level={1}>
            Asalamu
            <br />
            Alaykum
          </Typography.Heading>
          <Typography.Paragraph className="text-muted">
            How are you planning to use MasjidLove?
          </Typography.Paragraph>
        </div>

        <RadioGroup
          value={role ?? undefined}
          onChange={(v: string) => setRole(v as OnboardingRole)}
          aria-label="How will you use MasjidLove?"
        >
          <div className="flex gap-3">
            <RoleCard
              value="community"
              icon={<IconPeople size={36} />}
              title="Community"
              description="Find masjids near you, see what’s on and RSVP to events"
            />
            <RoleCard
              value="admin"
              icon={<IconAdmin size={36} />}
              title="Masjid admin"
              description="Post events and keep your masjid’s times up to date"
            />
          </div>
        </RadioGroup>

        <div className="flex items-start gap-2.5 rounded-3xl border border-foreground/10 shadow-premium bg-surface p-4">
          <span className="mt-0.5 flex-none text-muted">
            <IconQuestion size={20} />
          </span>
          <Typography.Paragraph size="sm" className="text-muted">
            Admin access is confirmed with your masjid before you can publish
            anything. You can start as community and ask later.
          </Typography.Paragraph>
        </div>
      </div>
    </OnboardingScreen>
  );
}
