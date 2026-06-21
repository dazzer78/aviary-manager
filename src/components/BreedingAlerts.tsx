import Link from "next/link";

type Alert = {
  title: string;
  message: string;
  count: number;
  priority: "critical" | "warning" | "info";
  href: string;
};

function badgeClass(priority: Alert["priority"]) {
  if (priority === "critical") return "bg-red-lt text-red";
  if (priority === "warning") return "bg-orange-lt text-orange";
  return "bg-blue-lt text-blue";
}

function icon(priority: Alert["priority"]) {
  if (priority === "critical") return "!";
  if (priority === "warning") return "?";
  return "i";
}

export default function BreedingAlerts({ alerts }: { alerts: Alert[] }) {
  return (
    <div className="card">
      <div className="card-header d-flex align-items-center justify-content-between">
        <div>
          <h3 className="card-title mb-0">Breeding Alerts</h3>
          <div className="text-muted small">Operational issues that need attention</div>
        </div>
        <span className="badge bg-blue-lt text-blue">{alerts.length} active</span>
      </div>
      <div className="list-group list-group-flush">
        {alerts.map((alert) => (
          <Link href={alert.href} className="list-group-item breeding-alert" key={alert.title}>
            <span className={`alert-icon ${badgeClass(alert.priority)}`}>{icon(alert.priority)}</span>
            <span className="alert-copy">
              <strong>{alert.count} {alert.title}</strong>
              <span>{alert.message}</span>
            </span>
            <span className={`badge ${badgeClass(alert.priority)}`}>{alert.priority}</span>
          </Link>
        ))}
        {alerts.length === 0 ? (
          <div className="list-group-item text-muted">No breeding alerts right now.</div>
        ) : null}
      </div>
    </div>
  );
}
