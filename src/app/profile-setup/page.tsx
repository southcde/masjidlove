"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  Description,
  Input,
  Label,
  ListBox,
  Select,
  TextField,
  Typography,
} from "@heroui/react";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { Hydrated } from "@/components/app/hydrated";
import { useUserState } from "@/hooks/use-user-state";
import { IconCamera } from "@/components/icons";

const AREAS = [
  "Gatesville",
  "Rylands",
  "District Six",
  "Mowbray",
  "Athlone",
  "Claremont",
  "Walmer Estate",
  "Bo-Kaap",
];

function ProfileSetupScreen() {
  const router = useRouter();
  const [state, update] = useUserState();
  const [name, setName] = useState(state.name);
  const [area, setArea] = useState<string>(state.area);

  function proceed() {
    update({ name, area });
    router.push("/location");
  }

  return (
    <OnboardingScreen
      back
      backHref="/role"
      step="Step 1 of 3"
      footer={
        <Button variant="primary" size="lg" fullWidth onPress={proceed}>
          Continue
        </Button>
      }
    >
      <div className="flex flex-1 flex-col gap-8 px-6">
        <div className="flex flex-col gap-2 pt-2">
          <Typography.Heading level={2}>Say salaam</Typography.Heading>
          <Typography.Paragraph className="text-muted">
            This is what people see when you RSVP to an event.
          </Typography.Paragraph>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-default text-muted">
              <IconCamera size={34} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 flex h-[34px] w-[34px] items-center justify-center rounded-full border-[3px] border-background bg-accent text-accent-foreground">
              <IconCamera size={17} />
            </div>
          </div>
          <Typography.Paragraph size="sm" className="text-muted">
            Add a photo — optional
          </Typography.Paragraph>
        </div>

        <div className="flex flex-col gap-5">
          <TextField
            name="name"
            value={name}
            onChange={setName}
            className="flex flex-col gap-2"
          >
            <Label>Your name</Label>
            <Input placeholder="Yusuf Adams" autoComplete="name" />
          </TextField>

          <Select
            name="area"
            value={area || null}
            onChange={(value) => setArea(String(value ?? ""))}
            placeholder="Choose an area"
          >
            <Label>
              Your area{" "}
              <span className="font-normal text-muted">— optional</span>
            </Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {AREAS.map((a) => (
                  <ListBox.Item key={a} id={a} textValue={a}>
                    {a}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
            <Description>
              Helps us suggest masjids even without location.
            </Description>
          </Select>
        </div>
      </div>
    </OnboardingScreen>
  );
}

export default function ProfileSetupPage() {
  return (
    <Hydrated>
      <ProfileSetupScreen />
    </Hydrated>
  );
}
