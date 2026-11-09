"use client";

import Link from "next/link";
import { LinkButton } from "@/components/link-button";
import { useAdmin } from "@/hooks/use-admin";
import { DataTable, EmptyState, PageHeader, Panel, StatCard, StatusPill, Td } from "@/components/admin/ui";
import { listAdminEvents } from "@/services/events";
import { listAdminClasses, seatsLeft, classWhen } from "@/services/learning";
import { formatRand, monthlyGiving } from "@/services/giving";
import { IconAlert } from "@/components/icons";

const FOLLOWERS_SAMPLE = 1240;

export default function AdminOverviewPage() {
  const { state, masjidId, masjid } = useAdmin();

  const events = listAdminEvents(masjidId, state.customEvents, state.eventEdits).filter(
    (e) => !e.cancelled
  );
  const classes = listAdminClasses(masjidId, state.customClasses, state.classEdits).filter(
    (c) => !c.cancelled
  );
  const months = monthlyGiving(state.donations, masjidId);
  const thisMonth = months[months.length - 1];
  const lastMonth = months[months.length - 2];
  const change = Math.round(((thisMonth.amount - lastMonth.amount) / lastMonth.amount) * 100);
  const maxMonth = Math.max(...months.map((m) => m.amount));

  const rsvps = events.reduce((sum, e) => sum + e.goingCount, 0);
  const seatsTaken = classes.reduce(
    (sum, c) => sum + c.takenSeats + (state.bookings[c.id] ?? 0),
    0
  );
  const seatsTotal = classes.reduce((sum, c) => sum + c.capacity, 0);

  const attention: { text: string; href: string }[] = [];
  classes
    .filter((c) => seatsLeft(c, state.bookings[c.id] ?? 0) === 0)
    .forEach((c) =>
      attention.push({ text: `“${c.title}” is full — consider a second session.`, href: "/admin/classes" })
    );
  events
    .filter((e) => e.goingCount === 0 && !e.cancelled)
    .forEach((e) =>
      attention.push({ text: `“${e.title}” has no RSVPs yet.`, href: "/admin/events" })
    );
  if (!state.masjidProfile[masjidId]?.about)
    attention.push({ text: "Add a short “about” so new visitors know your masjid.", href: "/admin/masjid" });
  if (!state.announcements.some((a) => a.masjidId === masjidId))
    attention.push({ text: "You haven’t posted an announcement yet.", href: "/admin/announcements" });

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle={`${masjid?.name} · ${masjid?.area}`}
        actions={
          <>
            <LinkButton href="/admin/events/new" variant="primary">
              New event
            </LinkButton>
            <LinkButton href="/admin/announcements" variant="outline">
              Post announcement
            </LinkButton>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard tone="accent" label="Followers" value={FOLLOWERS_SAMPLE.toLocaleString("en-ZA")} note="Sample figure" />
        <StatCard label="Upcoming events" value={events.length} note={`${rsvps} people going`} />
        <StatCard label="Class seats booked" value={`${seatsTaken}/${seatsTotal}`} note={`${classes.length} classes`} />
        <StatCard tone="gold" label="Given this month" value={formatRand(thisMonth.amount)} note={`${change >= 0 ? "+" : ""}${change}% on last month`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Panel
          title="Giving, last six months"
          action={<Link href="/admin/giving" className="text-[13.5px] font-medium text-link">Details</Link>}
        >
          <div className="flex h-[180px] items-end gap-3" role="img" aria-label="Monthly giving bar chart">
            {months.map((m, i) => (
              <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={`bar-grow-y w-full rounded-t-xl ${i === months.length - 1 ? "bg-gold" : "bg-accent/70"}`}
                  style={{ height: `${(m.amount / maxMonth) * 150}px` }}
                  title={`${m.label}: ${formatRand(m.amount)}`}
                />
                <span className="text-[12px] text-muted">{m.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-muted">
            Sample figures plus gifts made on this device. Real totals arrive with payments.
          </p>
        </Panel>

        <Panel title="Needs attention">
          {attention.length === 0 ? (
            <p className="text-[14px] text-muted">Nothing needs your attention. Well done.</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {attention.slice(0, 5).map((a) => (
                <li key={a.text}>
                  <Link
                    href={a.href}
                    className="flex items-start gap-2.5 rounded-2xl bg-gold-soft p-3 text-[13.5px] leading-snug text-gold-foreground"
                  >
                    <span className="mt-0.5 flex-none">
                      <IconAlert size={17} />
                    </span>
                    {a.text}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Next events" action={<Link href="/admin/events" className="text-[13.5px] font-medium text-link">Manage</Link>}>
          <DataTable
            columns={["Event", "Going"]}
            empty={events.length === 0 ? <EmptyState>No upcoming events.</EmptyState> : null}
          >
            {events.slice(0, 4).map((e) => (
              <tr key={e.id}>
                <Td>
                  <span className="font-medium">{e.title}</span>
                  <br />
                  <span className="text-[12.5px] text-muted">{e.date} · {e.time}</span>
                </Td>
                <Td>{e.goingCount}</Td>
              </tr>
            ))}
          </DataTable>
        </Panel>

        <Panel title="Next classes" action={<Link href="/admin/classes" className="text-[13.5px] font-medium text-link">Manage</Link>}>
          <DataTable
            columns={["Class", "Seats"]}
            empty={classes.length === 0 ? <EmptyState>No upcoming classes.</EmptyState> : null}
          >
            {classes.slice(0, 4).map((c) => {
              const left = seatsLeft(c, state.bookings[c.id] ?? 0);
              return (
                <tr key={c.id}>
                  <Td>
                    <span className="font-medium">{c.title}</span>
                    <br />
                    <span className="text-[12.5px] text-muted">{classWhen(c)}</span>
                  </Td>
                  <Td>
                    <StatusPill tone={left === 0 ? "bad" : left <= 5 ? "warn" : "good"}>
                      {left === 0 ? "Full" : `${left} left`}
                    </StatusPill>
                  </Td>
                </tr>
              );
            })}
          </DataTable>
        </Panel>
      </div>
    </>
  );
}
