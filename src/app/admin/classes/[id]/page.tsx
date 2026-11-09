"use client";

import { useParams } from "next/navigation";
import { ClassForm } from "@/components/admin/class-form";
import { PageHeader } from "@/components/admin/ui";
import { useAdmin } from "@/hooks/use-admin";
import { getClass } from "@/services/learning";

export default function EditClassPage() {
  const params = useParams<{ id: string }>();
  const { state } = useAdmin();
  const session = getClass(params.id, state.customClasses, state.classEdits);

  if (!session) {
    return <PageHeader title="Class not found" subtitle="It may have been deleted." />;
  }
  return (
    <>
      <PageHeader title="Edit class" subtitle={session.title} />
      <ClassForm initial={session} />
    </>
  );
}
