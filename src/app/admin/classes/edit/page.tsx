"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ClassForm } from "@/components/admin/class-form";
import { PageHeader } from "@/components/admin/ui";
import { useAdmin } from "@/hooks/use-admin";
import { getClass } from "@/services/learning";

function EditClassScreen() {
  const routeId = useSearchParams().get("id") ?? "";
  const { state } = useAdmin();
  const session = getClass(routeId, state.customClasses, state.classEdits);

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

export default function EditClassPage() {
  return (
    <Suspense fallback={null}>
      <EditClassScreen />
    </Suspense>
  );
}
