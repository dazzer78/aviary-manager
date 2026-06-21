import { notFound } from "next/navigation";
import { getUserAndAviary } from "@/lib/aviary";
import { deleteBird, updateBird } from "./actions";

function getSpeciesName(species: unknown): string {
  if (Array.isArray(species)) return String((species[0] as { name?: string } | undefined)?.name ?? "");
  return String((species as { name?: string } | null | undefined)?.name ?? "");
}

export default async function EditBirdPage({ params }: { params: Promise<{ ring: string }> }) {
  const { ring } = await params;
  const ringNumber = decodeURIComponent(ring);
  const { supabase, aviary } = await getUserAndAviary();

  const [{ data: bird, error }, { data: cages, error: cagesError }] = await Promise.all([
    supabase.from("birds").select("*, species(name)").eq("aviary_id", aviary.id).eq("ring_number", ringNumber).maybeSingle(),
    supabase.from("cages").select("id, name, cage_type, location").eq("aviary_id", aviary.id).order("name"),
  ]);

  if (error) throw new Error(error.message);
  if (cagesError) throw new Error(cagesError.message);
  if (!bird) notFound();

  const updateAction = updateBird.bind(null, ring);
  const deleteAction = deleteBird.bind(null, ring);

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Edit Bird</h2>
          <div className="text-muted">Update details for {bird.ring_number}</div>
        </div>
      </div>

      <form className="card mb-3" action={updateAction}>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4"><label className="form-label">Ring number</label><input name="ring_number" className="form-control" defaultValue={bird.ring_number} required /></div>
            <div className="col-md-4"><label className="form-label">Species</label><input name="species" className="form-control" defaultValue={getSpeciesName(bird.species)} /></div>
            <div className="col-md-4"><label className="form-label">Mutation</label><input name="mutation" className="form-control" defaultValue={bird.mutation ?? ""} /></div>
            <div className="col-md-4"><label className="form-label">Current Cage</label><select name="cage_id" className="form-select" defaultValue={bird.cage_id ?? ""}><option value="">No cage assigned</option>{(cages ?? []).map((cage) => <option key={cage.id} value={cage.id}>{cage.name} {cage.location ? `- ${cage.location}` : ""}</option>)}</select></div>
            <div className="col-md-4"><label className="form-label">Photo URL</label><input name="photo_url" className="form-control" defaultValue={bird.photo_url ?? ""} /></div>
            <div className="col-md-4"><label className="form-label">Sex</label><select name="sex" className="form-select" defaultValue={bird.sex ?? "unknown"}><option value="unknown">Unknown</option><option value="male">Male</option><option value="female">Female</option></select></div>
            <div className="col-md-4"><label className="form-label">Date of birth</label><input name="date_of_birth" className="form-control" type="date" defaultValue={bird.date_of_birth ?? ""} /></div>
            <div className="col-md-4"><label className="form-label">Status</label><select name="status" className="form-select" defaultValue={bird.status ?? "active"}><option value="active">Active</option><option value="young">Young Bird</option><option value="retained">Retained</option><option value="sold">Sold</option><option value="deceased">Deceased</option></select></div>
            <div className="col-12"><label className="form-label">Notes</label><textarea name="notes" className="form-control" rows={4} defaultValue={bird.notes ?? ""} /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary" type="submit">Save changes</button><a href={`/dashboard/birds/${encodeURIComponent(bird.ring_number)}`} className="btn btn-outline-secondary">Cancel</a></div>
        </div>
      </form>

      <form className="card border-danger" action={deleteAction}>
        <div className="card-body d-flex align-items-center justify-content-between gap-3">
          <div>
            <h3 className="mb-1 text-danger">Delete bird</h3>
            <div className="text-muted">This removes the bird record. Use only if it was added by mistake.</div>
          </div>
          <button className="btn btn-danger" type="submit">Delete bird</button>
        </div>
      </form>
    </>
  );
}
