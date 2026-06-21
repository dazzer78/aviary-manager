import Link from "next/link";
import { getUserAndAviary } from "@/lib/aviary";

export default async function CagesPage() {
  const { supabase, aviary } = await getUserAndAviary();

  const [{ data: cages, error: cagesError }, { data: birds, error: birdsError }] = await Promise.all([
    supabase.from("cages").select("id, name, cage_type, location, dimensions, capacity, status, notes").eq("aviary_id", aviary.id).order("created_at", { ascending: false }),
    supabase.from("birds").select("id, cage_id").eq("aviary_id", aviary.id),
  ]);

  if (cagesError) throw new Error(cagesError.message);
  if (birdsError) throw new Error(birdsError.message);

  function occupancy(cageId: string) {
    return (birds ?? []).filter((bird) => bird.cage_id === cageId).length;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Cages / Aviaries</h2>
          <div className="text-muted">Track cages, flights, hospital cages and occupancy.</div>
        </div>
        <Link href="/dashboard/cages/new" className="btn btn-primary">Add cage</Link>
      </div>

      <div className="row row-cards">
        {(cages ?? []).map((cage) => {
          const used = occupancy(cage.id);
          const capacity = cage.capacity ?? 0;
          const isFull = capacity > 0 && used >= capacity;

          return (
            <div className="col-md-6 col-xl-4" key={cage.id}>
              <div className="card h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <h3 className="mb-1">{cage.name}</h3>
                      <div className="text-muted">{cage.location || "No location"}</div>
                    </div>
                    <span className="badge bg-blue-lt text-blue">{cage.status}</span>
                  </div>
                  <div className="row g-3 mt-2">
                    <div className="col-6"><div className="subheader">Type</div><strong>{cage.cage_type}</strong></div>
                    <div className="col-6"><div className="subheader">Occupancy</div><strong className={isFull ? "text-danger" : ""}>{used}{capacity ? ` / ${capacity}` : ""}</strong></div>
                    <div className="col-12"><div className="subheader">Dimensions</div><strong>{cage.dimensions || "-"}</strong></div>
                    <div className="col-12"><div className="subheader">Notes</div><p className="mb-0 text-muted">{cage.notes || "No notes added."}</p></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {(cages ?? []).length === 0 ? <div className="col-12"><div className="card"><div className="card-body text-center text-muted py-5">No cages yet. Add your first cage.</div></div></div> : null}
      </div>
    </>
  );
}
