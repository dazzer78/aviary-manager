import { saveSeasonSettings } from "./actions";
import { getSeasonDefinitions, getUserAndAviary } from "@/lib/aviary";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const { supabase, aviary } = await getUserAndAviary();
  const seasons = await getSeasonDefinitions(supabase, aviary.id);

  return (
    <>
      <div className="page-header">
        <div>
          <h2 className="page-title">Settings</h2>
          <div className="text-muted">Define custom season date ranges. Unchanged years default to January through December.</div>
        </div>
      </div>

      {params.saved ? (
        <div className="card mb-3">
          <div className="card-body text-success">Season settings saved.</div>
        </div>
      ) : null}

      <form action={saveSeasonSettings} className="card">
        <div className="card-header">
          <h3 className="card-title mb-0">Season Dates</h3>
        </div>
        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <thead>
              <tr>
                <th>Season</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              {seasons.map((season) => (
                <tr key={season.year}>
                  <td>
                    <strong>{season.name}</strong>
                  </td>
                  <td>
                    <input
                      type="date"
                      name={`start_date_${season.year}`}
                      className="form-control"
                      defaultValue={season.start_date ?? `${season.year}-01-01`}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      name={`end_date_${season.year}`}
                      className="form-control"
                      defaultValue={season.end_date ?? `${season.year}-12-31`}
                    />
                  </td>
                  <td className="text-muted">{season.year}-01-01 to {season.year}-12-31</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card-body d-flex justify-content-between align-items-center">
          <div className="text-muted">Use full dates if a season spans across calendar years.</div>
          <button type="submit" className="btn btn-primary">Save season settings</button>
        </div>
      </form>
    </>
  );
}
