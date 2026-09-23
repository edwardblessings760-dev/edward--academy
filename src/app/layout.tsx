import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { ensureSeeded } from "@/db/seed";
import { getSettings } from "@/lib/data";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "EDWARD ACADEMY — Smart Notes. Past Papers. Better Results.",
  description:
    "Organised JCE and MSCE notes, past papers and exam tips for Malawian learners.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  await ensureSeeded();
  const [settings, adminSignedIn] = await Promise.all([getSettings(), isAdmin()]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white text-slate-800 antialiased">
        <SiteHeader siteName={settings.site_name} adminSignedIn={adminSignedIn} />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
