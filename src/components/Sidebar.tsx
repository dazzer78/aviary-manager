import Link from "next/link";

const items = [
  { label: "Dashboard", href: "/dashboard", section: "" },
  { label: "Birds", href: "/dashboard/birds", section: "BIRDS" },
  { label: "Pairs", href: "/dashboard/pairs", section: "BIRDS" },
  { label: "Breeding", href: "/dashboard/breeding", section: "BIRDS" },
  { label: "Eggs", href: "/dashboard/eggs", section: "BIRDS" },
  { label: "Chicks", href: "/dashboard/chicks", section: "BIRDS" },
  { label: "Ring Pending", href: "/dashboard/ring-pending", section: "BIRDS" },
  { label: "Treatments", href: "/dashboard/treatments", section: "BIRDS" },
  { label: "Gallery", href: "/dashboard/gallery", section: "BIRDS" },
  { label: "Sales", href: "/dashboard/sales", section: "FINANCE" },
  { label: "Expenses", href: "/dashboard/expenses", section: "FINANCE" },
  { label: "Reports", href: "/dashboard/reports", section: "FINANCE" },
  { label: "Settings", href: "/dashboard/settings", section: "FINANCE" },
] as const;

const icons: Record<string, string> = {
  "Dashboard": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  "Birds": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
  "Pairs": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  "Breeding": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5m-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11m3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>',
  "Eggs": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2c-3.314 0-6 2.239-6 5 0 2.5 1.5 4.5 3 5.5v7.5c0 .828.672 1.5 1.5 1.5h3c.828 0 1.5-.672 1.5-1.5V12.5c1.5-1 3-3 3-5.5 0-2.761-2.686-5-6-5z"/></svg>',
  "Chicks": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>',
  "Ring Pending": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/><polyline points="12 6 12 12 16 14"/></svg>',
  "Treatments": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2v20M2 12h20"/></svg>',
  "Gallery": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  "Sales": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z"/></svg>',
  "Expenses": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  "Reports": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>',
  "Settings": '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m3.08 3.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m3.08-3.08l4.24-4.24M19.78 19.78l-4.24-4.24m-3.08-3.08l-4.24-4.24M19.78 4.22l-4.24 4.24m-3.08 3.08l-4.24 4.24"/></svg>',
};

export default function Sidebar() {
  let currentSection = "";

  return (
    <aside className="navbar navbar-vertical navbar-expand-lg" style={{ width: "260px" }}>
      <div className="container-fluid">
        <h1 className="navbar-brand mb-4">
          <span className="brand-icon">🕊</span>
          <span>Aviary Manager</span>
        </h1>

        <div className="navbar-nav">
          {items.map((item) => {
            const sectionHeader = item.section !== currentSection ? item.section : "";
            currentSection = item.section;

            return (
              <div key={item.href}>
                {sectionHeader ? <div className="nav-section-title">{sectionHeader}</div> : null}
                <div className="nav-item">
                  <Link href={item.href} className="nav-link">
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