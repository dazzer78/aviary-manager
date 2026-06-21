import Link from "next/link";
import { fallbackImage, getUserAndAviary } from "@/lib/aviary";

function getSpeciesName(species: unknown): string | undefined {
  if (Array.isArray(species)) {
    const first = species[0] as { name?: string } | undefined;
    return first?.name;
  }

  return (species as { name?: string } | null | undefined)?.name;
}

function getRingNumber(bird: Record<string, unknown>): string {
  return String(bird.ring_number ?? bird.leg_ring ?? "-");
}

function getMutation(bird: Record<string, unknown>): string {
  return String(bird.mutation ?? bird.color_mutation ?? "-");
}

export default async function BirdsPage() {
  const { supabase, aviary } = await getUserAndAviary();
  const { data: birds, error } = await supabase
    .from("birds")
    .select("*, species(name)")
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
                  <td><div className="d-flex align-items-center gap-2"><img src={bird.photo_url || fallbackImage(bird.status)} alt={getRingNumber(bird)} className="bird-thumb" /><strong>{getRingNumber(bird)}</strong></div></td>
                  <td>{bird.name ?? "-"}</td>
                  <td>{getSpeciesName(bird.species) ?? "-"}</td>
                  <td>{getMutation(bird)}</td>
                  <td>{bird.sex}</td>
                  <td>{bird.date_of_birth ?? "-"}</td>
                  <td><span className="badge bg-blue-lt text-blue">{bird.status}</span></td>
                  <td className="text-end"><Link href={`/dashboard/birds/${encodeURIComponent(getRingNumber(bird))}`} className="btn btn-sm btn-outline-primary">View</Link></td>
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
