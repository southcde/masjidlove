"use client";

import { useState } from "react";
import { Button, FieldError, Form, Input, Label, TextArea, TextField } from "@heroui/react";
import { useAdmin } from "@/hooks/use-admin";
import { EmptyState, PageHeader, Panel } from "@/components/admin/ui";
import type { Announcement } from "@/types";

const FOLLOWERS = 1240;

function ago(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "short" }) +
    ", " + d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
}

export default function AdminAnnouncementsPage() {
  const { state, update, masjidId } = useAdmin();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({});

  const posts = state.announcements
    .filter((a) => a.masjidId === masjidId)
    .slice()
    .reverse();

  function post() {
    const found: typeof errors = {};
    if (!title.trim()) found.title = "Add a short headline, e.g. Parking change this Friday.";
    if (!body.trim()) found.body = "Write the message people will read.";
    setErrors(found);
    if (Object.keys(found).length) return;
    const announcement: Announcement = {
      id: `a-${Date.now().toString(36)}`,
      masjidId,
      title: title.trim(),
      body: body.trim(),
      at: new Date().toISOString(),
    };
    update({ announcements: [...state.announcements, announcement] });
    setTitle("");
    setBody("");
  }

  function remove(id: string) {
    update({ announcements: state.announcements.filter((a) => a.id !== id) });
  }

  return (
    <>
      <PageHeader
        title="Announcements"
        subtitle="Short notices for your followers. They appear on your masjid page and on Home."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr]">
        <Panel title="New announcement">
          <Form
            validationBehavior="aria"
            onSubmit={(e) => {
              e.preventDefault();
              post();
            }}
            className="flex flex-col gap-4"
          >
            <TextField
              value={title}
              onChange={(v) => {
                setTitle(v);
                setErrors((e) => ({ ...e, title: undefined }));
              }}
              isInvalid={Boolean(errors.title)}
              className="flex flex-col gap-2"
            >
              <Label>Headline</Label>
              <Input placeholder="Parking change this Friday" />
              <FieldError>{errors.title}</FieldError>
            </TextField>
            <TextField
              value={body}
              onChange={(v) => {
                setBody(v);
                setErrors((e) => ({ ...e, body: undefined }));
              }}
              isInvalid={Boolean(errors.body)}
              className="flex flex-col gap-2"
            >
              <Label>Message</Label>
              <TextArea rows={5} />
              <FieldError>{errors.body}</FieldError>
            </TextField>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[13px] text-muted">
                {FOLLOWERS.toLocaleString("en-ZA")} followers will be notified.
              </span>
              <Button type="submit" variant="primary">
                Post announcement
              </Button>
            </div>
          </Form>
        </Panel>

        <Panel title="Posted">
          {posts.length === 0 ? (
            <EmptyState>Nothing posted yet.</EmptyState>
          ) : (
            <ul className="flex flex-col gap-3">
              {posts.map((a) => (
                <li key={a.id} className="flex flex-col gap-1.5 rounded-2xl bg-surface p-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-display text-[18px] font-semibold leading-snug">
                      {a.title}
                    </span>
                    <Button size="sm" variant="ghost" className="text-danger" onPress={() => remove(a.id)}>
                      Delete
                    </Button>
                  </div>
                  <p className="text-[14px] leading-snug text-foreground/90">{a.body}</p>
                  <span className="text-[12px] text-muted">{ago(a.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}
