"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminEditButton from "@/components/AdminEditButton";
import PageEditor from "@/components/PageEditor";
import { isAdmin } from "@/lib/admin";
import { useAuth } from "@/lib/auth-context";
import type { SitePage } from "@/lib/site-content";

export default function PageInlineEditor({ page }: { page: SitePage }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (!isAdmin(user)) return null;

  return (
    <>
      <AdminEditButton label="Editar página" editing={open} onClick={() => setOpen((v) => !v)} />

      {open && (
        <PageEditor
          page={page}
          onDone={() => {
            setOpen(false);
            router.refresh();
          }}
          onCancel={() => setOpen(false)}
        />
      )}
    </>
  );
}
