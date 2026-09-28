"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { SitePage } from "@/lib/site-content";
import Footer from "./Footer";
import Header from "./Header";

export default function StoreChrome({
  children,
  footerPages,
}: {
  children: ReactNode;
  footerPages: SitePage[];
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer pages={footerPages} />
    </>
  );
}
