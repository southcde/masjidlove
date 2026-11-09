"use client";

import { EventForm } from "@/components/admin/event-form";
import { PageHeader } from "@/components/admin/ui";

export default function NewEventPage() {
  return (
    <>
      <PageHeader title="New event" subtitle="Followers are told when you publish." />
      <EventForm />
    </>
  );
}
