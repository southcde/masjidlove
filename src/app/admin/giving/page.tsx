"use client";

import { useState } from "react";
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Switch,
  TextArea,
  TextField,
} from "@heroui/react";
import { useAdmin } from "@/hooks/use-admin";
import { DataTable, EmptyState, PageHeader, Panel, StatCard, StatusPill, Td } from "@/components/admin/ui";
import { formatRand, KIND_COPY, monthlyGiving, SAMPLE_GIFTS } from "@/services/giving";
import type { Cause } from "@/types";

export default function AdminGivingPage() {
  const { state, update, masjidId } = useAdmin();
  const months = monthlyGiving(state.donations, masjidId);
  const total = months.reduce((s, m) => s + m.amount, 0);
  const thisMonth = months[months.length - 1].amount;
  const maxMonth = Math.max(...months.map((m) => m.amount));
  const mine = state.donations.filter((d) => d.kind === "masjid" && d.targetId === masjidId);
  const monthlyDonors = SAMPLE_GIFTS.filter((g) => g.monthly).length + mine.filter((d) => d.monthly).length;

  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [goal, setGoal] = useState("");
  const [zakat, setZakat] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; summary?: string; goal?: string }>({});

  function addCause() {
    const found: typeof errors = {};
    if (!name.trim()) found.name = "Give the appeal a name, e.g. Roof repairs.";
    if (!summary.trim()) found.summary = "Say what the money will do.";
    if (!Number(goal)) found.goal = "Enter a goal in rand, e.g. 50000.";
    setErrors(found);
    if (Object.keys(found).length) return;
    const cause: Cause = {
      id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${Date.now().toString(36)}`,
      name: name.trim(),
      summary: summary.trim(),
      goal: Number(goal),
      raised: 0,
      zakatEligible: zakat,
      tone: "emerald",
    };
    update({ customCauses: [...state.customCauses, cause] });
    setName("");
    setSummary("");
    setGoal("");
    setZakat(false);
  }

  function removeCause(id: string) {
    update({ customCauses: state.customCauses.filter((c) => c.id !== id) });
  }

  return (
    <>
      <PageHeader
        title="Giving"
        subtitle="Gifts to your masjid and your appeals. Donors stay anonymous to admins."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard tone="gold" label="This month" value={formatRand(thisMonth)} />
        <StatCard label="Last six months" value={formatRand(total)} />
        <StatCard label="Monthly givers" value={monthlyDonors} note="Recurring gifts" />
      </div>

      <Panel title="Month by month">
        <div className="flex h-[200px] items-end gap-3" role="img" aria-label="Monthly giving bar chart">
          {months.map((m, i) => (
            <div key={m.key} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-[12px] font-medium">{formatRand(m.amount)}</span>
              <div
                className={`bar-grow-y w-full rounded-t-xl ${i === months.length - 1 ? "bg-gold" : "bg-accent/70"}`}
                style={{ height: `${(m.amount / maxMonth) * 140}px` }}
              />
              <span className="text-[12px] text-muted">{m.label}</span>
            </div>
          ))}
        </div>
        <p className="text-[12px] text-muted">
          Sample figures plus gifts made on this device. Real totals arrive with payments.
        </p>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Recent gifts">
          <DataTable columns={["Donor", "Type", "Amount", "When"]}>
            {[
              ...mine
                .slice()
                .reverse()
                .map((d) => ({
                  id: d.id,
                  who: "Anonymous (this device)",
                  kind: d.kind,
                  amount: d.amount,
                  monthly: d.monthly,
                  when: "Just now",
                })),
              ...SAMPLE_GIFTS,
            ]
              .slice(0, 8)
              .map((g) => (
                <tr key={g.id}>
                  <Td>{g.who}</Td>
                  <Td>
                    <StatusPill tone={g.monthly ? "good" : "muted"}>
                      {KIND_COPY[g.kind].title}
                      {g.monthly ? " · monthly" : ""}
                    </StatusPill>
                  </Td>
                  <Td className="font-medium">{formatRand(g.amount)}</Td>
                  <Td className="text-muted">{g.when}</Td>
                </tr>
              ))}
          </DataTable>
        </Panel>

        <Panel title="Your appeals">
          {state.customCauses.length === 0 ? (
            <EmptyState>No appeals yet. Add one below and it appears on the Support tab.</EmptyState>
          ) : (
            <ul className="flex flex-col gap-2">
              {state.customCauses.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-surface p-3.5"
                >
                  <span className="flex min-w-0 flex-col">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-[12.5px] text-muted">
                      Goal {formatRand(c.goal)}
                      {c.zakatEligible ? " · accepts zakat" : ""}
                    </span>
                  </span>
                  <Button size="sm" variant="ghost" className="text-danger" onPress={() => removeCause(c.id)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}

          <Form
            validationBehavior="aria"
            onSubmit={(e) => {
              e.preventDefault();
              addCause();
            }}
            className="flex flex-col gap-4 border-t border-separator pt-4"
          >
            <TextField
              value={name}
              onChange={(v) => {
                setName(v);
                setErrors((e) => ({ ...e, name: undefined }));
              }}
              isInvalid={Boolean(errors.name)}
              className="flex flex-col gap-2"
            >
              <Label>Appeal name</Label>
              <Input placeholder="Roof repairs" />
              <FieldError>{errors.name}</FieldError>
            </TextField>
            <TextField
              value={summary}
              onChange={(v) => {
                setSummary(v);
                setErrors((e) => ({ ...e, summary: undefined }));
              }}
              isInvalid={Boolean(errors.summary)}
              className="flex flex-col gap-2"
            >
              <Label>What will it fund?</Label>
              <TextArea rows={3} />
              <FieldError>{errors.summary}</FieldError>
            </TextField>
            <TextField
              value={goal}
              onChange={(v) => {
                setGoal(v.replace(/[^0-9]/g, ""));
                setErrors((e) => ({ ...e, goal: undefined }));
              }}
              isInvalid={Boolean(errors.goal)}
              className="flex flex-col gap-2"
            >
              <Label>Goal (R)</Label>
              <Input inputMode="numeric" placeholder="50000" />
              <FieldError>{errors.goal}</FieldError>
            </TextField>
            <Switch isSelected={zakat} onChange={setZakat} className="flex items-center gap-3">
              <Switch.Control>
                <Switch.Thumb />
              </Switch.Control>
              <Switch.Content>
                <Label>Can receive zakat</Label>
                <Description>Only if it serves people in need directly. Ask your scholar if unsure.</Description>
              </Switch.Content>
            </Switch>
            <Button type="submit" variant="primary" className="self-end">
              Add appeal
            </Button>
          </Form>
        </Panel>
      </div>
    </>
  );
}
