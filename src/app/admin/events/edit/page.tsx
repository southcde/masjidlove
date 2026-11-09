"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EventForm } from "@/components/admin/event-form";
import { PageHeader } from "@/components/admin/ui";
import { useAdmin } from "@/hooks/use-admin";
import { getEvent } from "@/services/events";

function EditEventScreen() {
  const routeId = useSearchParams().get("id") ?? "";
  const { state } = useAdmin();
  const event = getEvent(routeId, state.customEvents, state.eventEdits);

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

export default function EditEventPage() {
  return (
    <Suspense fallback={null}>
      <EditEventScreen />
    </Suspense>
  );
}
