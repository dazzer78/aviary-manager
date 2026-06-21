"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Bird, CheckSquare, Egg, Heart, Image, LayoutDashboard, ListTree, Syringe, Warehouse } from "lucide-react";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Birds", href: "/dashboard/birds", icon: Bird },
  { label: "Cages", href: "/dashboard/cages", icon: Warehouse },
  { label: "Breeding", href: "/dashboard/breeding", icon: Heart },
  { label: "Analytics", href: "/dashboard/breeding/analytics", icon: BarChart3 },
  { label: "Clutches", href: "/dashboard/clutches", icon: Egg },
  { label: "Health", href: "/dashboard/health", icon: Syringe },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Photos", href: "/dashboard/photos", icon: Image },
  { label: "Species", href: "/dashboard/species", icon: ListTree },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="am-sidebar">
      <div className="am-brand">
        <div className="am-brand-icon"><Bird size={20} /></div>
        <div>
          <div className="am-brand-title">Aviary Manager</div>
          <div className="am-brand-subtitle">Breeding operations</div>
        </div>
      </div>

      <nav className="am-nav">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link href={item.href} key={item.href} className={`am-nav-link${active ? " active" : ""}`}>
              <Icon size={17} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="am-season-card">
        <div className="am-season-icon">*</div>
        <div>
          <strong>Seasonal focus</strong>
          <span>Track pairing, hatch rates and ringing tasks.</span>
        </div>
      </div>
    </aside>
  );
}
