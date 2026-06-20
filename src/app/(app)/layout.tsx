import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="dashboard-shell">
      <Sidebar />
      <div className="dashboard-content page-wrapper">
        <Topbar email={user.email ?? ""} />
        <main className="page-body">
          <div className="container-xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
