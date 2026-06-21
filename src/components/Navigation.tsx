import Link from "next/link";
import {
  IconHome,
  IconFeather,
  IconBox,
  IconUsers,
  IconEgg,
  IconActivity,
  IconList,
  IconCamera,
  IconLogout,
} from "@tabler/icons-react";

const navigationItems = [
  { href: "/dashboard", label: "Dashboard", icon: IconHome },
  { href: "/dashboard/birds", label: "Birds", icon: IconFeather },
  { href: "/dashboard/species", label: "Species", icon: IconBox },
  { href: "/dashboard/cages", label: "Cages", icon: IconBox },
  { href: "/dashboard/breeding", label: "Breeding Pairs", icon: IconUsers },
  { href: "/dashboard/clutches", label: "Clutches & Eggs", icon: IconEgg },
  { href: "/dashboard/health", label: "Health Records", icon: IconActivity },
  { href: "/dashboard/tasks", label: "Tasks", icon: IconList },
  { href: "/dashboard/photos", label: "Photos", icon: IconCamera },
];

export function MainNavigation() {
  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <Link href="/dashboard" className="navbar-brand navbar-brand-autodark">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="navbar-brand-image"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 3c-4.97 0 -9 2 -9 5v8c0 3 4.03 5 9 5s9 -2 9 -5v-8c0 -3 -4.03 -5 -9 -5" />
            <ellipse cx="12" cy="8" rx="9" ry="2" />
            <path d="M12 13v5" />
          </svg>
          <span className="navbar-brand-title">Aviary Manager</span>
        </Link>
      </div>
      <div className="navbar-nav flex-row-reverse">
        <div className="nav-item">
          <a href="/api/auth/logout" className="nav-link">
            <span className="nav-link-icon d-md-none d-lg-inline-block">
              <IconLogout size={20} />
            </span>
            <span className="nav-link-title">Logout</span>
          </a>
        </div>
      </div>
      <ul className="navbar-nav">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <li className="nav-item" key={item.href}>
              <Link href={item.href} className="nav-link">
                <span className="nav-link-icon d-md-none d-lg-inline-block">
                  <Icon size={20} />
                </span>
                <span className="nav-link-title">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function TopBar({ userName }: { userName?: string }) {
  return (
    <header className="navbar navbar-expand-md navbar-light sticky-top d-print-none">
      <div className="container-xl">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar-menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="navbar-nav flex-row order-md-last">
          <div className="nav-item d-none d-md-flex me-3">
            <div className="btn-list">
              <a href="#" className="btn">
                Need help?
              </a>
            </div>
          </div>
          <div className="nav-item dropdown">
            <a
              href="#"
              className="nav-link d-flex lh-1 text-reset p-0"
              data-bs-toggle="dropdown"
              aria-label="Open user menu"
            >
              <span className="avatar avatar-sm">
                {userName?.charAt(0).toUpperCase() || "U"}
              </span>
              <div className="d-none d-xl-block ps-2">
                <div>{userName || "User"}</div>
                <small className="text-body-secondary d-block mt-1">
                  Aviary Manager
                </small>
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
