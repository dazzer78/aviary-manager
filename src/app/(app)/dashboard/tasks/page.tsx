import Link from "next/link";
import { getUserAndAviary } from "@/lib/aviary";
import { completeTask } from "./actions";

function badge(priority: string) {
  if (priority === "high") return "bg-red-lt text-red";
  if (priority === "low") return "bg-green-lt text-green";
  return "bg-orange-lt text-orange";
}

export default async function TasksPage() {
  const { supabase, aviary } = await getUserAndAviary();
  const { data: tasks, error } = await supabase
    .from("tasks")
    .select("id, title, task_type, priority, status, due_at, description")
    .eq("aviary_id", aviary.id)
    .order("due_at", { ascending: true, nullsFirst: false });

  if (error) throw new Error(error.message);

  return (
    <>
      <div className="page-header">
        <div><h2 className="page-title">Tasks & Reminders</h2><div className="text-muted">Track ringing, cleaning, health and breeding reminders.</div></div>
        <Link href="/dashboard/tasks/new" className="btn btn-primary">Add task</Link>
      </div>
      <div className="card">
        <div className="table-responsive">
          <table className="table table-vcenter card-table">
            <thead><tr><th>Task</th><th>Type</th><th>Due</th><th>Priority</th><th>Status</th><th /></tr></thead>
            <tbody>
              {(tasks ?? []).map((task) => (
                <tr key={task.id}>
                  <td><strong>{task.title}</strong><div className="text-muted small">{task.description ?? ""}</div></td>
                  <td>{task.task_type}</td>
                  <td>{task.due_at ? new Date(task.due_at).toLocaleString("en-GB") : "-"}</td>
                  <td><span className={`badge ${badge(task.priority)}`}>{task.priority}</span></td>
                  <td><span className="badge bg-blue-lt text-blue">{task.status}</span></td>
                  <td className="text-end">{task.status !== "completed" ? <form action={completeTask}><input type="hidden" name="id" value={task.id} /><button className="btn btn-sm btn-outline-success" type="submit">Complete</button></form> : null}</td>
                </tr>
              ))}
              {(tasks ?? []).length === 0 ? <tr><td colSpan={6} className="text-center text-muted py-5">No tasks yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
