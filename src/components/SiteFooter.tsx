import Link from "next/link";

export default function SiteFooter({
  settings,
}: {
  settings: Record<string, string>;
}) {
  return (
    <footer className="mt-16 border-t border-navy-100 bg-navy-900 text-navy-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white text-sm font-black text-navy-900">
              EA
            </span>
            <span className="text-lg font-extrabold text-white">
              {settings.site_name}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-navy-200">
            {settings.footer_text}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide text-leaf-300 uppercase">
            Learn
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/notes" className="hover:text-white">
                All Notes
              </Link>
            </li>
            <li>
              <Link href="/past-papers" className="hover:text-white">
                Past Papers
              </Link>
            </li>
            <li>
              <Link href="/study-tips" className="hover:text-white">
                Study Tips
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-white">
                Search
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide text-leaf-300 uppercase">
            Levels
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/subjects?level=JCE" className="hover:text-white">
                Junior (JCE)
              </Link>
            </li>
            <li>
              <Link href="/subjects?level=MSCE" className="hover:text-white">
                Secondary (MSCE)
              </Link>
            </li>
            <li>
              <Link href="/notes?level=JCE" className="hover:text-white">
                JCE Notes
              </Link>
            </li>
            <li>
              <Link href="/notes?level=MSCE" className="hover:text-white">
                MSCE Notes
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold tracking-wide text-leaf-300 uppercase">
            Contact
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-navy-200">
            <li>WhatsApp: {settings.contact_whatsapp}</li>
            <li>Email: {settings.contact_email}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.site_name}. All rights reserved.
          </p>
          <Link href="/admin/login" className="text-navy-400 hover:text-white">
            Staff area
          </Link>
        </div>
      </div>
    </footer>
  );
}
