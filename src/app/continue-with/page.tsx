"use client";

import { Link, Typography } from "@heroui/react";
import { OnboardingScreen } from "@/components/onboarding/screen";
import { LinkButton } from "@/components/link-button";
import Image from "next/image";
import {
  IconApple,
  IconFacebook,
  IconGoogle,
  IconMail,
} from "@/components/icons";

export default function ContinueWithPage() {
  return (
    <OnboardingScreen back backHref="/">
      <div className="flex flex-1 flex-col justify-center gap-10 pb-16">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/app-icon.png"
            alt="MasjidLove"
            width={76}
            height={76}
            className="block h-[76px] w-[76px] rounded-[19px]"
          />
          <Typography.Heading level={2}>Create your account</Typography.Heading>
          <Typography.Paragraph className="max-w-[290px] text-center text-muted">
            One account, all your masjids. Nothing is shared without you
            choosing to.
          </Typography.Paragraph>
        </div>

        <div className="flex flex-col gap-3">
          <LinkButton
            href="/create-account"
            variant="primary"
            size="lg"
            fullWidth
          >
            <IconMail size={20} />
            Continue with email
          </LinkButton>
          {/* Social sign-in is a mock until auth exists — every path
              continues to account creation. */}
          <LinkButton
            href="/create-account"
            variant="secondary"
            size="lg"
            fullWidth
          >
            <IconApple size={20} />
            Continue with Apple
          </LinkButton>
          <LinkButton
            href="/create-account"
            variant="secondary"
            size="lg"
            fullWidth
          >
            <IconGoogle size={20} />
            Continue with Google
          </LinkButton>
          <LinkButton
            href="/create-account"
            variant="secondary"
            size="lg"
            fullWidth
          >
            <IconFacebook size={20} />
            Continue with Facebook
          </LinkButton>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <Typography.Paragraph size="sm" className="text-muted">
            Already have an account?
          </Typography.Paragraph>
          <Link
            href="/log-in"
            className="text-base font-semibold text-link no-underline"
          >
            Log in
          </Link>
        </div>
      </div>

      <footer className="flex-none px-6 pb-6">
        <Typography.Paragraph size="xs" className="text-center text-muted">
          By continuing you agree to the{" "}
          <Link href="/terms" className="text-link">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-link">
            privacy notice
          </Link>
          .
        </Typography.Paragraph>
      </footer>
    </OnboardingScreen>
  );
}
