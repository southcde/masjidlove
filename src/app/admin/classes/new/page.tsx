"use client";

import { ClassForm } from "@/components/admin/class-form";
import { PageHeader } from "@/components/admin/ui";

export default function NewClassPage() {
  return (
    <>
      <PageHeader title="New class" subtitle="People can book seats as soon as you publish." />
      <ClassForm />
    </>
  );
}
