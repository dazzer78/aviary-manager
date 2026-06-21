import Link from "next/link";
import { fallbackImage, getUserAndAviary } from "@/lib/aviary";

export default async function BirdsPage() {
  const { supabase, aviary } = await getUserAndAviary();
  const { data: birds, error } = await supabase
    .from("birds")
    .select("id, ring_number, name, sex, mutation, date_of_birth, status, photo_url, species(name)")
    .eq("aviary_id", aviary.id)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Birds</h2>
          <div className="text-muted">Live bird records from Supabase.</div>
        </div>
        <Link href="/dashboard/birds/new" className="btn btn-primary">Add bird</Link>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <thead><tr><th>Ring Number</th><th>Name</th><th>Species</th><th>Mutation</th><th>Sex</th><th>DOB</th><th>Status</th><th /></tr></thead>
            <tbody>
              {(birds ?? []).map((bird) => (
                <tr key={bird.id}>
                  <td><div className="d-flex align-items-center gap-2"><img src={bird.photo_url || fallbackImage(bird.status)} alt={bird.ring_number} className="bird-thumb" /><strong>{bird.ring_number}</strong></div></td>
                  <td>{bird.name ?? "-"}</td>
                  <td>{bird.species?.name ?? "-"}</td>
                  <td>{bird.mutation ?? "-"}</td>
                  <td>{bird.sex}</td>
                  <td>{bird.date_of_birth ?? "-"}</td>
                  <td><span className="badge bg-blue-lt text-blue">{bird.status}</span></td>
                  <td className="text-end"><Link href={`/dashboard/birds/${bird.ring_number}`} className="btn btn-sm btn-outline-primary">View</Link></td>
                </tr>
              ))}
              {(birds ?? []).length === 0 ? <tr><td colSpan={8} className="text-center text-muted py-5">No birds yet. Add your first bird.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
