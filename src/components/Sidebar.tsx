import Link from "next/link";
import {
  IconDashboard,
  IconEgg,
  IconHeartHandshake,
  IconPill,
  IconCash,
  IconPhoto,
  IconSettings,
} from "@tabler/icons-react";

const items = [
  ["Dashboard", "/dashboard", IconDashboard],
  ["Birds", "/birds", IconHeartHandshake],
  ["Pairs", "/pairs", IconHeartHandshake],
  ["Breeding", "/breeding", IconEgg],
  ["Treatments", "/treatments", IconPill],
  ["Gallery", "/gallery", IconPhoto],
  ["Sales", "/sales", IconCash],
  ["Settings", "/settings", IconSettings],
] as const;

export default function Sidebar() {
  return (
    <aside className="navbar navbar-vertical navbar-expand-lg">
      <div className="container-fluid">
        <div className="navbar-brand mb-3">Aviary Manager</div>

        <div className="navbar-nav pt-lg-3">
          {items.map(([label, href, Icon]) => (
            <div className="nav-item" key={href}>
              <Link href={href} className="nav-link">
                <span className="nav-link-icon">
                  <Icon size={20} />
                </span>
                <span className="nav-link-title">{label}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
