"use client";

import { useParams } from "next/navigation";
import { EventForm } from "@/components/admin/event-form";
import { PageHeader } from "@/components/admin/ui";
import { useAdmin } from "@/hooks/use-admin";
import { getEvent } from "@/services/events";

export default function EditEventPage() {
  const params = useParams<{ id: string }>();
  const { state } = useAdmin();
  const event = getEvent(params.id, state.customEvents, state.eventEdits);

  if (!event) {
    return <PageHeader title="Event not found" subtitle="It may have been deleted." />;
  }
  return (
    <>
      <PageHeader title="Edit event" subtitle={event.title} />
      <EventForm initial={event} />
    </>
  );
}
