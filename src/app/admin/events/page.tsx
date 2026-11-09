"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertDialog, Button } from "@heroui/react";
import { LinkButton } from "@/components/link-button";
import { useAdmin } from "@/hooks/use-admin";
import { DataTable, EmptyState, PageHeader, Panel, StatusPill, Td } from "@/components/admin/ui";
import { listAdminEvents } from "@/services/events";
import type { Event } from "@/types";

export default function AdminEventsPage() {
  const { state, update, masjidId } = useAdmin();
  const [confirm, setConfirm] = useState<Event | null>(null);

  const events = listAdminEvents(masjidId, state.customEvents, state.eventEdits);
  const isCustom = (id: string) => state.customEvents.some((e) => e.id === id);

  function setCancelled(id: string, cancelled: boolean) {
    update({
      eventEdits: { ...state.eventEdits, [id]: { ...state.eventEdits[id], cancelled } },
    });
  }

  function remove(event: Event) {
    const edits = { ...state.eventEdits };
    delete edits[event.id];
    update({
      customEvents: state.customEvents.filter((e) => e.id !== event.id),
      eventEdits: edits,
    });
    setConfirm(null);
  }

  return (
    <>
      <PageHeader
        title="Events"
        subtitle="Everything happening at your masjid. Counts only — RSVPs are never listed by name."
        actions={
          <LinkButton href="/admin/events/new" variant="primary">
            New event
          </LinkButton>
        }
      />

      <Panel>
        <DataTable
          columns={["Event", "When", "Where", "Going", "Maybe", "Status", ""]}
          empty={events.length === 0 ? <EmptyState>No events yet. Create your first one.</EmptyState> : null}
        >
          {events.map((e) => (
            <tr key={e.id} className={e.cancelled ? "opacity-60" : ""}>
              <Td>
                <Link href={`/events/${e.id}`} className="font-medium hover:underline">
                  {e.title}
                </Link>
                {e.kind && <span className="block text-[12.5px] text-muted">{e.kind}</span>}
              </Td>
              <Td className="whitespace-nowrap">
                {e.date}
                <span className="block text-[12.5px] text-muted">{e.time}</span>
              </Td>
              <Td className="text-muted">{e.whereNote ?? "—"}</Td>
              <Td>{e.goingCount}</Td>
              <Td>{e.maybeCount}</Td>
              <Td>
                {e.cancelled ? (
                  <StatusPill tone="bad">Cancelled</StatusPill>
                ) : (
                  <StatusPill tone="good">Published</StatusPill>
                )}
              </Td>
              <Td>
                <div className="flex justify-end gap-1.5">
                  <LinkButton href={`/admin/events/${e.id}`} size="sm" variant="outline">
                    Edit
                  </LinkButton>
                  <Button
                    size="sm"
                    variant="ghost"
                    onPress={() => setCancelled(e.id, !e.cancelled)}
                  >
                    {e.cancelled ? "Restore" : "Cancel"}
                  </Button>
                  {isCustom(e.id) && (
                    <Button size="sm" variant="ghost" className="text-danger" onPress={() => setConfirm(e)}>
                      Delete
                    </Button>
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      </Panel>

      <AlertDialog isOpen={confirm !== null} onOpenChange={(open) => !open && setConfirm(null)}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Heading>Delete this event?</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                “{confirm?.title}” will be removed for good. To hide it but keep
                it, cancel it instead.
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button variant="outline" onPress={() => setConfirm(null)}>
                  Keep it
                </Button>
                <Button variant="danger" onPress={() => confirm && remove(confirm)}>
                  Delete event
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </>
  );
}
