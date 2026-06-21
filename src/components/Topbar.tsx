"use client";

import { createClient } from "@/lib/supabase/client";
import NotificationCentre from "@/components/NotificationCentre";

export default function Topbar({ email }: { email: string }) {
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const userName = email?.split("@")[0] || "User";

  return (
    <header className="navbar navbar-expand-md d-print-none">
      <div className="container-xl d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <h2 className="navbar-brand mb-0">Dashboard</h2>
          <span className="badge bg-blue-lt text-blue">Season 2026</span>
        </div>

        <div className="d-flex align-items-center gap-3 topbar-actions">
          <input
            type="text"
            className="form-control"
            placeholder="Search birds, rings, cages..."
            style={{ width: 280 }}
          />

          <NotificationCentre />

          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#2563eb,#7c3aed)",
                color: "white",
                display: "grid",
                placeItems: "center",
                fontWeight: 700,
              }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-secondary">{userName}</span>
            <button
              className="btn btn-outline-danger btn-sm"
              type="button"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
