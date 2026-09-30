"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import type { Category } from "@/lib/categories";
import type { SitePage } from "@/lib/site-content";
import Footer from "./Footer";
import Header from "./Header";

export default function StoreChrome({
  children,
  footerPages,
  categories,
}: {
  children: ReactNode;
  footerPages: SitePage[];
  categories: Category[];
}) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer pages={footerPages} />
    </>
  );
}
