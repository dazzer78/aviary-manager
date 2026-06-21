import { createTask } from "./actions";

export default function NewTaskPage() {
  return (
    <>
      <div className="page-header"><div><h2 className="page-title">Add Task</h2><div className="text-muted">Create a reminder for breeding, health or general aviary work.</div></div></div>
      <form className="card" action={createTask}>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label">Title</label><input name="title" className="form-control" placeholder="Ring chicks" required /></div>
            <div className="col-md-3"><label className="form-label">Type</label><select name="task_type" className="form-select"><option value="general">General</option><option value="breeding">Breeding</option><option value="health">Health</option><option value="cleaning">Cleaning</option><option value="medication">Medication</option></select></div>
            <div className="col-md-3"><label className="form-label">Priority</label><select name="priority" className="form-select"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></div>
            <div className="col-md-6"><label className="form-label">Due date/time</label><input name="due_at" type="datetime-local" className="form-control" /></div>
            <div className="col-12"><label className="form-label">Description</label><textarea name="description" className="form-control" rows={4} /></div>
          </div>
          <div className="mt-4 d-flex gap-2"><button className="btn btn-primary" type="submit">Save task</button><a href="/dashboard/tasks" className="btn btn-outline-secondary">Cancel</a></div>
        </div>
      </form>
    </>
  );
}
