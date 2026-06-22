import Link from "next/link";
import { getUserAndAviary } from "@/lib/aviary";

function displayDate(date?: string | null) {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-GB");
}

function isPast(date?: string | null) {
  if (!date) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(date) < today;
}

export default async function IncubatingPage() {
  const { supabase, aviary } = await getUserAndAviary();
  const { data: eggs, error } = await supabase
    .from("eggs")
    .select("id, egg_number, laid_date, expected_hatch_date, hatch_date, status, clutch_id")
    .eq("aviary_id", aviary.id)
    .eq("status", "incubating")
    .order("expected_hatch_date", { ascending: true, nullsFirst: false });

  if (error) throw new Error(error.message);

  const rows = eggs ?? [];
  const overdue = rows.filter((egg) => !egg.hatch_date && isPast(egg.expected_hatch_date)).length;

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Incubating</h2>
          <div className="text-muted">Eggs currently marked as incubating.</div>
        </div>
        <Link href="/dashboard/clutches" className="btn btn-outline-primary">View clutches</Link>
      </div>

      <div className="row row-cards mb-3">
        <Metric title="Incubating" value={rows.length} />
        <Metric title="Overdue" value={overdue} />
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <thead>
              <tr><th>Egg</th><th>Clutch</th><th>Laid</th><th>Expected hatch</th><th>Status</th></tr>
            </thead>
            <tbody>
              {rows.map((egg) => (
                <tr key={egg.id}>
                  <td><strong>{egg.egg_number ? `Egg ${egg.egg_number}` : "Egg record"}</strong></td>
                  <td>{egg.clutch_id || "-"}</td>
                  <td>{displayDate(egg.laid_date)}</td>
                  <td>{displayDate(egg.expected_hatch_date)}</td>
                  <td><span className={isPast(egg.expected_hatch_date) ? "badge bg-red-lt text-red" : "badge bg-blue-lt text-blue"}>{egg.status}</span></td>
                </tr>
              ))}
              {rows.length === 0 ? <tr><td colSpan={5} className="text-center text-muted py-5">No eggs currently incubating.</td></tr> : null}
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
