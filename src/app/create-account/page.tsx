"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Button,
  Checkbox,
  Description,
  FieldError,
  Input,
  Label,
  TextField,
  Typography,
} from "@heroui/react";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { useUserState } from "@/hooks/use-user-state";

export default function CreateAccountPage() {
  const router = useRouter();
  const [, update] = useUserState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailMe, setEmailMe] = useState(true);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) {
      setPasswordError("Password needs at least 8 characters.");
      return;
    }
    setPasswordError(null);
    update({ name, email });
    router.push("/verify-email");
  }

  return (
    <OnboardingScreen back backHref="/continue-with">
      <div className="flex flex-1 flex-col gap-7 px-6">
        <div className="flex flex-col gap-2 pt-2">
          <Typography.Heading level={2}>Create your account</Typography.Heading>
          <Typography.Paragraph className="text-muted">
            Takes about a minute.
          </Typography.Paragraph>
        </div>

        <form onSubmit={submit} className="flex flex-col gap-5" noValidate>
          <TextField
            name="name"
            isRequired
            value={name}
            onChange={setName}
            className="flex flex-col gap-2"
          >
            <Label>Your name</Label>
            <Input placeholder="Yusuf Adams" autoComplete="name" />
          </TextField>

          <TextField
            name="email"
            type="email"
            isRequired
            value={email}
            onChange={setEmail}
            className="flex flex-col gap-2"
          >
            <Label>Email address</Label>
            <Input placeholder="you@example.com" autoComplete="email" />
          </TextField>

          <div className="flex flex-col gap-2">
            <TextField
              name="password"
              isRequired
              minLength={8}
              type={passwordError ? "text" : "password"}
              value={password}
              onChange={(v) => {
                setPassword(v);
                setPasswordError(null);
              }}
              isInvalid={passwordError !== null}
              className="flex flex-col gap-2"
            >
              <Label>Password</Label>
              <Input
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
              />
              {passwordError ? (
                <FieldError>{passwordError}</FieldError>
              ) : (
                <Description>At least 8 characters.</Description>
              )}
            </TextField>
          </div>

          <Checkbox
            name="email-me"
            isSelected={emailMe}
            onChange={setEmailMe}
            className="items-start"
            aria-label="Email me when a masjid I follow posts an event or changes a salaah time"
          >
            <span className="text-base leading-normal">
              Email me when a masjid I follow posts an event or changes a
              salaah time.
            </span>
          </Checkbox>

          <Button type="submit" variant="primary" size="lg" fullWidth>
            Create account
          </Button>
        </form>
      </div>
    </OnboardingScreen>
  );
}
