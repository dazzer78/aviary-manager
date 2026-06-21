import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { birdImageUrl, getUserAndAviary } from "@/lib/aviary";

type FamilyBird = {
  id: string;
  ring_number: string;
  mutation: string | null;
  sex: string | null;
  photo_url: string | null;
  status?: string | null;
};

function card(title: string, bird: FamilyBird | null | undefined, active = false) {
  return (
    <div className={`card h-100 ${active ? "border-primary" : ""}`}>
      <div className="card-body text-center">
        {bird?.photo_url ? <Image unoptimized src={bird.photo_url} alt={bird.ring_number} width={96} height={96} style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover" }} /> : <div className="avatar avatar-xl mx-auto mb-3">{title[0]}</div>}
        <div className="subheader mt-2">{title}</div>
        <h3 className="mb-1">{bird?.ring_number ?? "Unknown"}</h3>
        <div className="text-muted">{bird?.mutation ?? bird?.sex ?? "No record"}</div>
      </div>
    </div>
  );
}

export default async function BirdFamilyPage({ params }: { params: Promise<{ ring: string }> }) {
  const { ring } = await params;
  const ringNumber = decodeURIComponent(ring);
  const { supabase, aviary } = await getUserAndAviary();

  const { data: bird } = await supabase.from("birds").select("id, ring_number, mutation, sex, photo_url, species(name)").eq("aviary_id", aviary.id).eq("ring_number", ringNumber).maybeSingle();
  if (!bird) notFound();

  const { data: parentage } = await supabase.from("bird_parentage").select("father_bird_id, mother_bird_id").eq("aviary_id", aviary.id).eq("bird_id", bird.id).maybeSingle();
  const parentIds = [parentage?.father_bird_id, parentage?.mother_bird_id].filter(Boolean);
  const { data: parents } = parentIds.length ? await supabase.from("birds").select("id, ring_number, mutation, sex, photo_url").in("id", parentIds) : { data: [] };
  const father = parents?.find((item) => item.id === parentage?.father_bird_id);
  const mother = parents?.find((item) => item.id === parentage?.mother_bird_id);

  const { data: offspringRows } = await supabase.from("bird_parentage").select("bird_id").eq("aviary_id", aviary.id).or(`father_bird_id.eq.${bird.id},mother_bird_id.eq.${bird.id}`);
  const offspringIds = (offspringRows ?? []).map((row) => row.bird_id);
  const { data: offspring } = offspringIds.length ? await supabase.from("birds").select("id, ring_number, mutation, sex, status, photo_url").in("id", offspringIds) : { data: [] };

  return (
    <>
      <div className="page-header">
        <div><h2 className="page-title">Family Tree</h2><div className="text-muted">{bird.ring_number} pedigree and offspring</div></div>
        <Link href={`/dashboard/birds/${encodeURIComponent(bird.ring_number)}`} className="btn btn-outline-primary">Back to profile</Link>
      </div>

      <div className="row row-cards mb-3">
        <div className="col-md-4">{card("Father", father)}</div>
        <div className="col-md-4">{card("This Bird", bird, true)}</div>
        <div className="col-md-4">{card("Mother", mother)}</div>
      </div>

      <div className="card">
        <div className="card-header"><h3 className="card-title mb-0">Offspring</h3></div>
        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <thead><tr><th>Ring</th><th>Mutation</th><th>Sex</th><th>Status</th><th /></tr></thead>
            <tbody>
              {(offspring ?? []).map((child) => <tr key={child.id}><td><Image unoptimized src={birdImageUrl(child)} alt={child.ring_number} className="bird-thumb me-2" width={32} height={32} />{child.ring_number}</td><td>{child.mutation ?? "-"}</td><td>{child.sex}</td><td>{child.status}</td><td><Link href={`/dashboard/birds/${encodeURIComponent(child.ring_number)}`} className="btn btn-sm btn-outline-primary">View</Link></td></tr>)}
              {(offspring ?? []).length === 0 ? <tr><td colSpan={5} className="text-center text-muted py-4">No offspring recorded.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
