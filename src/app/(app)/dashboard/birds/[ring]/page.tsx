import Link from "next/link";
import { notFound } from "next/navigation";
import BirdPhotoGalleryPanel from "@/components/BirdPhotoGalleryPanel";
import { birdImageUrl, getUserAndAviary } from "@/lib/aviary";

function getRingNumber(bird: Record<string, unknown>): string {
  return String(bird.ring_number ?? bird.leg_ring ?? "-");
}

function getMutation(bird: Record<string, unknown>): string {
  return String(bird.mutation ?? bird.color_mutation ?? "-");
}

function getSpeciesName(species: unknown): string | undefined {
  if (Array.isArray(species)) return (species[0] as { name?: string } | undefined)?.name;
  return (species as { name?: string } | null | undefined)?.name;
}

export default async function BirdProfilePage({ params }: { params: Promise<{ ring: string }> }) {
  const { ring } = await params;
  const { supabase, aviary } = await getUserAndAviary();
  const ringParam = decodeURIComponent(ring);

  const { data: bird, error } = await supabase
    .from("birds")
    .select("*, species(name)")
    .eq("aviary_id", aviary.id)
    .eq("ring_number", ringParam)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!bird) notFound();

  const birdRingNumber = getRingNumber(bird);

  const [{ data: treatments }, { data: photos }] = await Promise.all([
    supabase.from("treatments").select("id, treatment_name, treatment_date, follow_up_date, dosage, reason").eq("aviary_id", aviary.id).eq("bird_id", bird.id).order("treatment_date", { ascending: false }),
    supabase.from("bird_photos").select("id, image_url, caption, is_primary, file_name").eq("aviary_id", aviary.id).eq("bird_id", bird.id).order("is_primary", { ascending: false }).order("created_at", { ascending: false }),
  ]);

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">{birdRingNumber}</h2>
          <div className="text-muted">{getSpeciesName(bird.species) ?? "Unknown species"}</div>
        </div>
        <div className="d-flex gap-2">
          <Link href={`/dashboard/birds/${encodeURIComponent(birdRingNumber)}/family`} className="btn btn-outline-primary">Family tree</Link>
          <Link href={`/dashboard/birds/${encodeURIComponent(birdRingNumber)}/edit`} className="btn btn-primary">Edit bird</Link>
        </div>
      </div>

      <div className="row row-cards">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body text-center">
              <img src={birdImageUrl(bird)} alt={birdRingNumber} style={{ width: 180, height: 180, borderRadius: "50%", objectFit: "cover" }} />
              <h3 className="mt-3 mb-1">{birdRingNumber}</h3>
              <span className="badge bg-blue-lt text-blue">{bird.status}</span>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card mb-3">
            <div className="card-header"><h3 className="card-title mb-0">Details</h3></div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6"><div className="subheader">Ring number</div><strong>{birdRingNumber}</strong></div>
                <div className="col-md-6"><div className="subheader">Species</div><strong>{getSpeciesName(bird.species) ?? "-"}</strong></div>
                <div className="col-md-6"><div className="subheader">Mutation</div><strong>{getMutation(bird)}</strong></div>
                <div className="col-md-6"><div className="subheader">Sex</div><strong>{bird.sex}</strong></div>
                <div className="col-md-6"><div className="subheader">Date of birth</div><strong>{bird.date_of_birth ?? "-"}</strong></div>
                <div className="col-md-6"><div className="subheader">Status</div><strong>{bird.status}</strong></div>
                <div className="col-12"><div className="subheader">Notes</div><p className="mb-0">{bird.notes || "No notes added."}</p></div>
              </div>
            </div>
          </div>

          <BirdPhotoGalleryPanel ring={birdRingNumber} photos={photos ?? []} />

          <div className="card">
            <div className="card-header"><h3 className="card-title mb-0">Treatment History</h3></div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table">
                <thead><tr><th>Date</th><th>Treatment</th><th>Dosage</th><th>Reason</th><th>Follow-up</th></tr></thead>
                <tbody>
                  {(treatments ?? []).map((item) => <tr key={item.id}><td>{item.treatment_date}</td><td>{item.treatment_name}</td><td>{item.dosage ?? "-"}</td><td>{item.reason ?? "-"}</td><td>{item.follow_up_date ?? "-"}</td></tr>)}
                  {(treatments ?? []).length === 0 ? <tr><td colSpan={5} className="text-center text-muted py-4">No treatment history.</td></tr> : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
