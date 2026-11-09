"use client";

import { useState } from "react";
import { Button, Description, Input, Label, TextArea, TextField } from "@heroui/react";
import { useAdmin } from "@/hooks/use-admin";
import { PageHeader, Panel } from "@/components/admin/ui";
import { PatternArt } from "@/components/app/pattern-art";
import { LinkButton } from "@/components/link-button";
import { masjidHref } from "@/services/routes";

export default function AdminMasjidPage() {
  const { state, update, masjid, masjidId } = useAdmin();
  const saved = state.masjidProfile[masjidId] ?? {};

  const [address, setAddress] = useState(saved.address ?? masjid?.address ?? "");
  const [phone, setPhone] = useState(saved.phone ?? masjid?.phone ?? "");
  const [about, setAbout] = useState(saved.about ?? "");
  const [jumuahNote, setJumuahNote] = useState(saved.jumuahNote ?? "");
  const [justSaved, setJustSaved] = useState(false);

  function save() {
    update({
      masjidProfile: {
        ...state.masjidProfile,
        [masjidId]: {
          address: address.trim() || undefined,
          phone: phone.trim() || undefined,
          about: about.trim() || undefined,
          jumuahNote: jumuahNote.trim() || undefined,
        },
      },
    });
    setJustSaved(true);
  }

  return (
    <>
      <PageHeader
        title="Masjid profile"
        subtitle="What visitors see on your page."
        actions={
          <LinkButton href={masjidHref(masjidId)} variant="outline">
            View public page
          </LinkButton>
        }
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Panel title="Details">
          <div className="flex flex-col gap-5">
            <TextField isReadOnly value={masjid?.name ?? ""} className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input />
              <Description>Name and area changes need the live database.</Description>
            </TextField>
            <TextField
              value={address}
              onChange={(v) => {
                setAddress(v);
                setJustSaved(false);
              }}
              className="flex flex-col gap-2"
            >
              <Label>Address</Label>
              <Input autoComplete="street-address" />
            </TextField>
            <TextField
              value={phone}
              onChange={(v) => {
                setPhone(v);
                setJustSaved(false);
              }}
              className="flex flex-col gap-2"
            >
              <Label>Phone</Label>
              <Input type="tel" autoComplete="tel" />
            </TextField>
            <TextField
              value={jumuahNote}
              onChange={(v) => {
                setJumuahNote(v);
                setJustSaved(false);
              }}
              className="flex flex-col gap-2"
            >
              <Label>Jumuʿah note</Label>
              <Input placeholder="Khutbah in English, doors open 12:15" />
            </TextField>
            <TextField
              value={about}
              onChange={(v) => {
                setAbout(v);
                setJustSaved(false);
              }}
              className="flex flex-col gap-2"
            >
              <Label>About</Label>
              <TextArea rows={5} placeholder="A few lines about your masjid and community." />
            </TextField>
            <div className="flex items-center justify-end gap-3">
              {justSaved && <span className="text-[13.5px] font-medium text-accent">Saved.</span>}
              <Button variant="primary" onPress={save}>
                Save changes
              </Button>
            </div>
          </div>
        </Panel>

        <Panel title="Photo">
          <PatternArt tone="emerald" scene="masjid" className="h-[200px] rounded-2xl" />
          <p className="text-[13.5px] leading-snug text-muted">
            Photo uploads arrive with the database. Until then your page uses
            this illustrated placeholder.
          </p>
          <Button variant="outline" isDisabled>
            Upload photo
          </Button>
        </Panel>
      </div>
    </>
  );
}
