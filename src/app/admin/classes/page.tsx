"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertDialog, Button } from "@heroui/react";
import { LinkButton } from "@/components/link-button";
import { useAdmin } from "@/hooks/use-admin";
import { DataTable, EmptyState, PageHeader, Panel, StatusPill, Td } from "@/components/admin/ui";
import { classWhen, listAdminClasses, seatsLeft } from "@/services/learning";
import type { ClassSession } from "@/types";

export default function AdminClassesPage() {
  const { state, update, masjidId } = useAdmin();
  const [confirm, setConfirm] = useState<ClassSession | null>(null);

  const classes = listAdminClasses(masjidId, state.customClasses, state.classEdits);
  const isCustom = (id: string) => state.customClasses.some((c) => c.id === id);

  function setCancelled(id: string, cancelled: boolean) {
    update({
      classEdits: { ...state.classEdits, [id]: { ...state.classEdits[id], cancelled } },
    });
  }

  function remove(session: ClassSession) {
    const edits = { ...state.classEdits };
    delete edits[session.id];
    update({
      customClasses: state.customClasses.filter((c) => c.id !== session.id),
      classEdits: edits,
    });
    setConfirm(null);
  }

  return (
    <>
      <PageHeader
        title="Classes"
        subtitle="In-person classes people can book. Bookings show as counts, never names."
        actions={
          <LinkButton href="/admin/classes/new" variant="primary">
            New class
          </LinkButton>
        }
      />

      <Panel>
        <DataTable
          columns={["Class", "When", "Seats", "Price", "Waitlist", "Status", ""]}
          empty={classes.length === 0 ? <EmptyState>No classes yet. Create your first one.</EmptyState> : null}
        >
          {classes.map((c) => {
            const mine = state.bookings[c.id] ?? 0;
            const left = seatsLeft(c, mine);
            const booked = c.capacity - left;
            const waitlisted = state.waitlist.includes(c.id) ? 1 : 0;
            return (
              <tr key={c.id} className={c.cancelled ? "opacity-60" : ""}>
                <Td>
                  <Link href={`/learn/class/${c.id}`} className="font-medium hover:underline">
                    {c.title}
                  </Link>
                  <span className="block text-[12.5px] text-muted">{c.teacher}</span>
                </Td>
                <Td className="whitespace-nowrap">{classWhen(c)}</Td>
                <Td className="whitespace-nowrap">
                  {booked}/{c.capacity}
                </Td>
                <Td>{c.price}</Td>
                <Td>{waitlisted}</Td>
                <Td>
                  {c.cancelled ? (
                    <StatusPill tone="bad">Cancelled</StatusPill>
                  ) : left === 0 ? (
                    <StatusPill tone="warn">Full</StatusPill>
                  ) : (
                    <StatusPill tone="good">{left} left</StatusPill>
                  )}
                </Td>
                <Td>
                  <div className="flex justify-end gap-1.5">
                    <LinkButton href={`/admin/classes/${c.id}`} size="sm" variant="outline">
                      Edit
                    </LinkButton>
                    <Button size="sm" variant="ghost" onPress={() => setCancelled(c.id, !c.cancelled)}>
                      {c.cancelled ? "Restore" : "Cancel"}
                    </Button>
                    {isCustom(c.id) && (
                      <Button size="sm" variant="ghost" className="text-danger" onPress={() => setConfirm(c)}>
                        Delete
                      </Button>
                    )}
                  </div>
                </Td>
              </tr>
            );
          })}
        </DataTable>
      </Panel>

      <AlertDialog isOpen={confirm !== null} onOpenChange={(open) => !open && setConfirm(null)}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Heading>Delete this class?</AlertDialog.Heading>
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
                  Delete class
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>
    </>
  );
}
