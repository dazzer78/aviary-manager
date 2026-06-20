"use client";

import { createClient } from "@/lib/supabase/client";

export default function Topbar({ email }: { email: string }) {
  const supabase = createClient();

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <header className="navbar navbar-expand-md d-print-none">
      <div className="container-xl">
        <div className="navbar-nav flex-row ms-auto align-items-center gap-2">
          <span className="nav-link text-secondary">{email}</span>
          <button className="btn btn-outline-danger btn-sm" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
