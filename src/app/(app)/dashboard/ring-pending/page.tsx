import Link from "next/link";
import { getRingNumber, getUserAndAviary } from "@/lib/aviary";

function displayDate(date?: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
}

function daysOverdue(date?: string | null) {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((today.getTime() - target.getTime()) / 86400000));
}

export default async function RingPendingPage() {
  const { supabase, aviary } = await getUserAndAviary();
  const today = new Date().toISOString().slice(0, 10);

  const { data: chicks, error } = await supabase
    .from("chicks")
    .select("id, bird_id, hatch_date, ring_due_date, ringed_date, status")
    .eq("aviary_id", aviary.id)
    .lte("ring_due_date", today)
    .in("status", ["alive", "hatched"])
    .order("ring_due_date", { ascending: true, nullsFirst: false });

  if (error) throw new Error(error.message);

  const rows = chicks ?? [];
  const birdIds = rows.map((chick) => chick.bird_id).filter(Boolean) as string[];
  const { data: birds } = birdIds.length
    ? await supabase.from("birds").select("id, ring_number, leg_ring, species(name), mutation, sex").in("id", birdIds)
    : { data: [] };
  const birdById = new Map((birds ?? []).map((bird) => [bird.id, bird]));

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Ring Pending</h2>
          <div className="text-muted">Chicks that are due or overdue to be ringed.</div>
        </div>
        <Link href="/dashboard/birds" className="btn btn-outline-primary">View birds</Link>
      </div>

      <div className="row row-cards mb-3">
        <Metric title="Pending" value={rows.length} />
        <Metric title="Overdue" value={rows.filter((chick) => daysOverdue(chick.ring_due_date) !== null).length} />
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <thead>
              <tr><th>Bird / chick</th><th>Hatch date</th><th>Ring due</th><th>Overdue</th><th>Status</th></tr>
            </thead>
            <tbody>
              {rows.map((chick) => {
                const bird = chick.bird_id ? birdById.get(chick.bird_id) : undefined;
                const overdue = daysOverdue(chick.ring_due_date);
                return (
                  <tr key={chick.id}>
                    <td><strong>{bird ? getRingNumber(bird, "Unringed chick") : "Unringed chick"}</strong></td>
                    <td>{displayDate(chick.hatch_date)}</td>
                    <td>{displayDate(chick.ring_due_date)}</td>
                    <td>{overdue === null ? "-" : overdue === 0 ? "Due today" : `${overdue} days`}</td>
                    <td><span className="badge bg-orange-lt text-orange">{chick.status}</span></td>
                  </tr>
                );
              })}
              {rows.length === 0 ? <tr><td colSpan={5} className="text-center text-muted py-5">No chicks are currently due for ringing.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return <div className="col-sm-6 col-lg-3"><div className="card"><div className="card-body"><div className="subheader">{title}</div><div className="h2 mb-0">{value}</div></div></div></div>;
}
