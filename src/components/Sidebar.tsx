"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Dashboard", href: "/dashboard", section: "" },
  { label: "Birds", href: "/dashboard/birds", section: "BIRDS" },
  { label: "Cages", href: "/dashboard/cages", section: "BIRDS" },
  { label: "Pairs", href: "/dashboard/pairs", section: "BIRDS" },
  { label: "Breeding", href: "/dashboard/breeding", section: "BIRDS" },
  { label: "Analytics", href: "/dashboard/breeding/analytics", section: "BIRDS" },
  { label: "Eggs", href: "/dashboard/eggs", section: "BIRDS" },
  { label: "Chicks", href: "/dashboard/chicks", section: "BIRDS" },
  { label: "Ring Pending", href: "/dashboard/ring-pending", section: "BIRDS" },
  { label: "Treatments", href: "/dashboard/treatments", section: "BIRDS" },
  { label: "Tasks", href: "/dashboard/tasks", section: "BIRDS" },
  { label: "Gallery", href: "/dashboard/gallery", section: "BIRDS" },
  { label: "Sales", href: "/dashboard/sales", section: "FINANCE" },
  { label: "Expenses", href: "/dashboard/expenses", section: "FINANCE" },
  { label: "Reports", href: "/dashboard/reports", section: "FINANCE" },
  { label: "Settings", href: "/dashboard/settings", section: "FINANCE" },
] as const;

const icons: Record<string, string> = {
  Dashboard: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  Birds: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2c2.8 0 5 2.2 5 5 0 1.8-.9 3.4-2.3 4.3L20 20H4l5.3-8.7A5 5 0 0 1 12 2z"/><path d="M10 7h.01"/><path d="M14 7h.01"/></svg>',
  Cages: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 4v16"/><path d="M12 4v16"/><path d="M16 4v16"/><path d="M4 10h16"/></svg>',
  Pairs: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  Breeding: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21s-7-4.4-7-11a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 6.6-7 11-7 11z"/></svg>',
  Analytics: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 15v-5"/><path d="M12 15V8"/><path d="M16 15v-3"/></svg>',
  Eggs: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 3C8 3 5 8 5 13a7 7 0 0 0 14 0c0-5-3-10-7-10z"/></svg>',
  Chicks: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><path d="M8 13h8"/><path d="M10 9h.01"/><path d="M14 9h.01"/></svg>',
  "Ring Pending": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/></svg>',
  Treatments: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 21h4"/><path d="M12 17v4"/><path d="M7 7h10"/><path d="M9 3h6"/><path d="M9 7v7a3 3 0 0 0 6 0V7"/></svg>',
  Tasks: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  Gallery: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  Sales: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/></svg>',
  Expenses: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  Reports: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 15v-5"/><path d="M12 15V8"/><path d="M16 15v-3"/></svg>',
  Settings: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/></svg>',
};

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const pathname = usePathname();
  let currentSection = "";

  return (
    <aside className="navbar navbar-vertical navbar-expand-lg">
      <div className="container-fluid">
        <h1 className="navbar-brand mb-4"><span className="brand-icon">🕊</span><span>Aviary Manager</span></h1>
        <div className="navbar-nav">
          {items.map((item) => {
            const sectionHeader = item.section !== currentSection ? item.section : "";
            currentSection = item.section;
            const active = isActive(pathname, item.href);
            return (
              <div key={item.href}>
                {sectionHeader ? <div className="nav-section-title">{sectionHeader}</div> : null}
                <div className="nav-item">
                  <Link href={item.href} className={`nav-link${active ? " active" : ""}`} aria-current={active ? "page" : undefined}>
                    <span className="nav-link-icon" dangerouslySetInnerHTML={{ __html: icons[item.label] }} />
                    <span className="nav-link-title">{item.label}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
