import Link from "next/link";
import BreedingAlerts from "@/components/BreedingAlerts";
import DashboardCharts from "@/components/DashboardCharts";
import { birdImageUrl, getDashboardData } from "@/lib/aviary";

const quickActions = [
  { label: "Add Bird", href: "/dashboard/birds/new", icon: "🐦" },
  { label: "Create Pair", href: "/dashboard/pairs/new", icon: "💞" },
  { label: "Record Egg", href: "/dashboard/eggs/new", icon: "🥚" },
  { label: "Add Treatment", href: "/dashboard/treatments/new", icon: "💊" },
  { label: "Record Sale", href: "/dashboard/sales/new", icon: "💷" },
];

function monthName(date?: string | null) {
  if (!date) return "Unknown";
  return new Date(date).toLocaleString("en-GB", { month: "short" });
}

function buildMonthly(eggs: any[], chicks: any[]) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((month) => ({
    month,
    eggs: eggs.filter((egg) => monthName(egg.expected_hatch_date) === month).length,
    chicks: chicks.filter((chick) => monthName(chick.ring_due_date) === month).length,
  }));
}

function speciesMix(birds: any[]) {
  const counts = new Map<string, number>();
  for (const bird of birds) counts.set(bird.species?.name ?? "Unknown", (counts.get(bird.species?.name ?? "Unknown") ?? 0) + 1);
  const rows = Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
  return rows.length ? rows : [{ name: "No birds yet", value: 1 }];
}

function isPast(date?: string | null) {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) < today;
}

function buildBreedingAlerts(data: Awaited<ReturnType<typeof getDashboardData>>) {
  const dueRinging = data.chicks.filter((chick: any) => chick.status === "alive" && isPast(chick.ring_due_date)).length;
  const overdueTreatments = data.treatments.filter((treatment: any) => isPast(treatment.follow_up_date)).length;
  const overdueEggs = data.eggs.filter((egg: any) => egg.status === "incubating" && !egg.hatch_date && isPast(egg.expected_hatch_date)).length;
  const overdueTasks = data.tasks.filter((task: any) => task.status !== "completed" && isPast(task.due_at)).length;
  const overCapacity = data.cages.filter((cage: any) => {
    if (!cage.capacity) return false;
    const count = data.birds.filter((bird: any) => bird.cage_id === cage.id).length;
    return count > cage.capacity;
  }).length;
  const inactivePairs = data.pairs.filter((pair: any) => {
    if (pair.status !== "active" || !pair.created_at) return false;
    const days = Math.floor((Date.now() - new Date(pair.created_at).getTime()) / 86400000);
    return days > 30;
  }).length;

  return [
    dueRinging ? { title: "chicks overdue for ringing", message: "Ring dates have passed. Review ring pending records.", count: dueRinging, priority: "critical" as const, href: "/dashboard/ring-pending" } : null,
    overdueTreatments ? { title: "overdue treatment follow-ups", message: "Treatment follow-up dates have passed.", count: overdueTreatments, priority: "critical" as const, href: "/dashboard/treatments" } : null,
    overdueEggs ? { title: "eggs past expected hatch", message: "Expected hatch date has passed without a hatch record.", count: overdueEggs, priority: "warning" as const, href: "/dashboard/eggs" } : null,
    overdueTasks ? { title: "overdue tasks", message: "Open reminders are now overdue.", count: overdueTasks, priority: "critical" as const, href: "/dashboard/tasks" } : null,
    overCapacity ? { title: "cages over capacity", message: "One or more cages are above their set capacity.", count: overCapacity, priority: "warning" as const, href: "/dashboard/cages" } : null,
    inactivePairs ? { title: "pairs active over 30 days", message: "Review breeding progress for long-running active pairs.", count: inactivePairs, priority: "info" as const, href: "/dashboard/breeding/workflow" } : null,
  ].filter(Boolean) as Array<{ title: string; message: string; count: number; priority: "critical" | "warning" | "info"; href: string }>;
}

export default async function DashboardPage() {
  const data = await getDashboardData();
  const birds = data.birds;
  const activePairs = data.pairs.filter((pair: any) => pair.status === "active");
  const incubatingEggs = data.eggs.filter((egg: any) => egg.status === "incubating");
  const chicksThisSeason = data.chicks.filter((chick: any) => ["alive", "ringed", "weaned"].includes(chick.status));
  const breedingAlerts = buildBreedingAlerts(data);

  const upcomingHatches = incubatingEggs.slice(0, 5);
  const tasks = [
    ...data.tasks.slice(0, 3).map((task: any) => task.due_at ? `${task.title} due ${new Date(task.due_at).toLocaleDateString("en-GB")}` : task.title),
    ...data.chicks.filter((chick: any) => chick.status === "alive" && chick.ring_due_date).slice(0, 2).map((chick: any) => `Ring chick due ${chick.ring_due_date}`),
    ...data.treatments.filter((treatment: any) => treatment.follow_up_date).slice(0, 2).map((treatment: any) => `Follow up treatment: ${treatment.treatment_name}`),
  ].slice(0, 5);

  return (
    <>
      <div className="quick-actions mb-3">
        {quickActions.map((action) => (
          <Link href={action.href} className="quick-action" key={action.label}>
            <span className="quick-action-icon">{action.icon}</span>
            <span>{action.label}</span>
          </Link>
        ))}
      </div>

      <BreedingAlerts alerts={breedingAlerts} />

      <div className="row row-cards mb-3 mt-3">
        <StatCard title="Total Birds" value={birds.length} note="Live Supabase count" colour="#171717" />
        <StatCard title="Active Pairs" value={activePairs.length} note="Currently breeding" colour="#404040" />
        <StatCard title="Eggs Incubating" value={incubatingEggs.length} note="Awaiting hatch" colour="#737373" />
        <StatCard title="Chicks This Season" value={chicksThisSeason.length} note="Alive/ringed/weaned" colour="#a3a3a3" />
      </div>

      <DashboardCharts monthly={buildMonthly(data.eggs as any[], data.chicks as any[])} species={speciesMix(birds)} />

      <div className="row row-cards">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between"><h3 className="card-title mb-0">Tasks Due</h3><Link href="/dashboard/tasks" className="btn btn-sm btn-outline-primary">View tasks</Link></div>
            <div className="list-group list-group-flush">
              {tasks.map((task) => <div className="list-group-item" key={task}>{task}</div>)}
              {tasks.length === 0 ? <div className="list-group-item text-muted">No urgent tasks.</div> : null}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header"><h3 className="card-title mb-0">Upcoming Hatches</h3></div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead><tr><th>Egg</th><th>Expected Date</th><th>Status</th></tr></thead>
                <tbody>
                  {upcomingHatches.map((egg: any) => <tr key={egg.id}><td>Egg record</td><td>{egg.expected_hatch_date ?? "-"}</td><td><span className="badge bg-blue-lt text-blue">{egg.status}</span></td></tr>)}
                  {upcomingHatches.length === 0 ? <tr><td colSpan={3} className="text-center text-muted py-4">No upcoming hatches.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-header d-flex align-items-center justify-content-between"><h3 className="card-title mb-0">Recent Birds Added</h3><Link href="/dashboard/birds" className="btn btn-sm btn-outline-primary">View all</Link></div>
        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <thead><tr><th>Ring Number</th><th>Species</th><th>Mutation</th><th>Sex</th><th>Status</th></tr></thead>
            <tbody>
              {birds.slice(0, 8).map((bird) => <tr key={bird.id}><td><div className="d-flex align-items-center gap-2"><img src={birdImageUrl(bird)} alt={bird.ring_number} className="bird-thumb" /><span>{bird.ring_number}</span></div></td><td>{bird.species?.name ?? "-"}</td><td>{bird.mutation ?? "-"}</td><td>{bird.sex}</td><td><span className="badge bg-blue-lt text-blue">{bird.status}</span></td></tr>)}
              {birds.length === 0 ? <tr><td colSpan={5} className="text-center text-muted py-4">No birds yet. Add your first bird.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, note, colour }: { title: string; value: number; note: string; colour: string }) {
  return (
    <div className="col-sm-6 col-lg-3">
      <div className="card stat-card">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className="avatar avatar-lg me-3" style={{ backgroundColor: colour, color: "white" }}>•</div>
            <div><div className="subheader">{title}</div><div className="h2 mb-0">{value}</div></div>
          </div>
          <div className="text-muted text-sm mt-2">{note}</div>
        </div>
      </div>
    </div>
  );
}
