import Image from "next/image";
import Link from "next/link";
import { getSelectedSeasonYear, matchesSeason } from "@/lib/season";
import { birdImageUrl, getMutation, getRingNumber, getSeasonDefinitionByYear, getSeasonDefinitions, getSpeciesName, getUserAndAviary } from "@/lib/aviary";

export default async function BirdsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const q = (params.q ?? "").toLowerCase();
  const sex = params.sex ?? "";
  const status = params.status ?? "active-paired";
  const cage = params.cage ?? "";

  const { supabase, aviary } = await getUserAndAviary();
  const seasons = await getSeasonDefinitions(supabase, aviary.id);
  const seasonYear = await getSelectedSeasonYear(seasons.map((season) => season.year));
  const selectedSeason = getSeasonDefinitionByYear(seasons, seasonYear);
  const [{ data: birds, error }, { data: cages }, { data: pairs, error: pairsError }] = await Promise.all([
    supabase.from("birds").select("*, species(name), cages(name), created_at").eq("aviary_id", aviary.id).order("created_at", { ascending: false }),
    supabase.from("cages").select("id, name").eq("aviary_id", aviary.id).order("name"),
    supabase.from("pairs").select("male_bird_id, female_bird_id, status").eq("aviary_id", aviary.id).eq("status", "active"),
  ]);

  if (error) throw new Error(error.message);
  if (pairsError) throw new Error(pairsError.message);

  const pairedBirdIds = new Set<string>();
  for (const pair of pairs ?? []) {
    if (pair.male_bird_id) pairedBirdIds.add(pair.male_bird_id);
    if (pair.female_bird_id) pairedBirdIds.add(pair.female_bird_id);
  }

  const seasonBirds = (birds ?? []).filter((bird) =>
    matchesSeason(selectedSeason, bird.date_of_birth, bird.created_at)
  );

  const filtered = seasonBirds.filter((bird) => {
    const paired = pairedBirdIds.has(bird.id) || bird.status === "paired";
    const statusMatch = status === "active-paired"
      ? bird.status === "active" || paired
      : !status || bird.status === status || (status === "paired" && paired);
    const text = [getRingNumber(bird), getSpeciesName(bird.species), getMutation(bird), bird.notes].join(" ").toLowerCase();
    return (!q || text.includes(q)) && (!sex || bird.sex === sex) && statusMatch && (!cage || bird.cage_id === cage);
  });

  return (
    <>
      <div className="page-header">
        <div><h2 className="page-title">Birds</h2><div className="text-muted">Search, filter and manage bird records.</div></div>
        <Link href="/dashboard/birds/new" className="btn btn-primary">Add bird</Link>
      </div>

      <div className="row row-cards mb-3">
        <Metric title="Results" value={filtered.length} />
        <Metric title="Active" value={filtered.filter((b) => b.status === "active").length} />
        <Metric title="Paired" value={filtered.filter((b) => pairedBirdIds.has(b.id) || b.status === "paired").length} />
        <Metric title="Young" value={filtered.filter((b) => b.status === "young").length} />
      </div>

      <form className="card mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4"><label className="form-label">Search</label><input name="q" defaultValue={params.q ?? ""} className="form-control" placeholder="Ring, species, mutation, notes" /></div>
            <div className="col-md-2"><label className="form-label">Sex</label><select name="sex" defaultValue={sex} className="form-select"><option value="">All</option><option value="male">Male</option><option value="female">Female</option><option value="unknown">Unknown</option></select></div>
            <div className="col-md-2"><label className="form-label">Status</label><select name="status" defaultValue={status} className="form-select"><option value="active-paired">Active + Paired</option><option value="">All</option><option value="active">Active</option><option value="paired">Paired</option><option value="young">Young</option><option value="retained">Retained</option><option value="sold">Sold</option></select></div>
            <div className="col-md-2"><label className="form-label">Cage</label><select name="cage" defaultValue={cage} className="form-select"><option value="">All</option>{(cages ?? []).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
            <div className="col-md-2 d-flex align-items-end gap-2"><button className="btn btn-primary" type="submit">Filter</button><Link href="/dashboard/birds" className="btn btn-outline-secondary">Reset</Link></div>
          </div>
        </div>
      </form>

      <div className="card">
        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <thead><tr><th>Ring Number</th><th>Species</th><th>Mutation</th><th>Sex</th><th>Cage</th><th>DOB</th><th>Status</th><th>Pair</th><th /></tr></thead>
            <tbody>
              {filtered.map((bird) => {
                const paired = pairedBirdIds.has(bird.id) || bird.status === "paired";
                return (
                  <tr key={bird.id}>
                    <td><div className="d-flex align-items-center gap-2"><Image unoptimized src={birdImageUrl(bird)} alt={getRingNumber(bird)} className="bird-thumb" width={32} height={32} /><strong>{getRingNumber(bird)}</strong></div></td>
                    <td>{getSpeciesName(bird.species) ?? "-"}</td><td>{getMutation(bird)}</td><td>{bird.sex}</td><td>{bird.cages?.name ?? "-"}</td><td>{bird.date_of_birth ?? "-"}</td><td><span className="badge bg-blue-lt text-blue">{bird.status}</span></td><td>{paired ? <span className="badge bg-green-lt text-green">Paired</span> : <span className="text-muted">-</span>}</td>
                    <td className="text-end"><Link href={`/dashboard/birds/${encodeURIComponent(getRingNumber(bird))}`} className="btn btn-sm btn-outline-primary">View</Link></td>
                  </tr>
                );
              })}
              {filtered.length === 0 ? <tr><td colSpan={9} className="text-center text-muted py-5">No birds match those filters.</td></tr> : null}
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
