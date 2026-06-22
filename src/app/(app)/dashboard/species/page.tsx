import Link from "next/link";
import { getUserAndAviary } from "@/lib/aviary";
import { getSpecies } from "@/lib/supabase/queries";

export default async function SpeciesPage() {
  const { supabase, aviary } = await getUserAndAviary();

  const [{ data: birds, error: birdsError }, species] = await Promise.all([
    supabase.from("birds").select("id, species_id").eq("aviary_id", aviary.id),
    getSpecies(supabase, aviary.id),
  ]);

  if (birdsError) throw new Error(birdsError.message);

  function speciesBirdCount(speciesId: string) {
    return (birds ?? []).filter((bird) => bird.species_id === speciesId).length;
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Species</h2>
          <div className="text-muted">View the species configured for this aviary.</div>
        </div>
        <Link href="/dashboard/birds/new" className="btn btn-primary">Add bird</Link>
      </div>

      <div className="row row-cards mb-3">
        <Metric title="Species" value={species.length} />
        <Metric title="Birds Mapped" value={(birds ?? []).filter((bird) => bird.species_id).length} />
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table card-table table-vcenter">
            <thead>
              <tr>
                <th>Name</th>
                <th>Scientific Name</th>
                <th>Birds</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {species.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.name}</strong></td>
                  <td>{item.scientific_name || "-"}</td>
                  <td>{speciesBirdCount(item.id)}</td>
                  <td>{item.notes || "-"}</td>
                </tr>
              ))}
              {species.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-5">
                    No species found for this aviary yet. Add a bird with a new species to create one automatically.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="col-sm-6 col-lg-3">
      <div className="card">
        <div className="card-body">
          <div className="subheader">{title}</div>
          <div className="h2 mb-0">{value}</div>
        </div>
      </div>
    </div>
  );
}
