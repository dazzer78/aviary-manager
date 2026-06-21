"use client";

import { useState } from "react";

const notifications = [
  {
    title: "Ring due tomorrow",
    message: "4 Zebra Finch chicks from Pair 06 are due to be ringed.",
    time: "Tomorrow",
    type: "Ring",
    priority: "High",
  },
  {
    title: "Hatch expected",
    message: "Gouldian Pair 3, Nest #12 has eggs due around 22 Jun.",
    time: "2 days",
    type: "Hatch",
    priority: "Medium",
  },
  {
    title: "Treatment reminder",
    message: "Bird GB24-00123 has a follow-up treatment due today.",
    time: "Today",
    type: "Health",
    priority: "High",
  },
  {
    title: "Nest check due",
    message: "Check Canary Pair 7, Nest #03 for progress notes.",
    time: "Today",
    type: "Breeding",
    priority: "Low",
  },
];

function priorityClass(priority: string) {
  if (priority === "High") return "bg-red-lt text-red";
  if (priority === "Medium") return "bg-orange-lt text-orange";
  return "bg-green-lt text-green";
}

export default function NotificationCentre() {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.length;

  return (
    <div className="notification-centre">
      <button
        className="notification-trigger btn btn-icon btn-outline-secondary"
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        🔔
        <span className="notification-count">{unreadCount}</span>
      </button>

      {open ? (
        <div className="notification-panel">
          <div className="notification-header">
            <div>
              <strong>Notifications</strong>
              <div className="text-muted small">Rings, hatches and treatments</div>
            </div>
            <span className="badge bg-blue-lt text-blue">{unreadCount} new</span>
          </div>

          <div className="notification-list">
            {notifications.map((item) => (
              <div className="notification-item" key={item.title}>
                <div className="notification-dot" />
                <div className="notification-content">
                  <div className="d-flex justify-content-between gap-2">
                    <strong>{item.title}</strong>
                    <span className="text-muted small">{item.time}</span>
                  </div>
                  <p>{item.message}</p>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-blue-lt text-blue">{item.type}</span>
                    <span className={`badge ${priorityClass(item.priority)}`}>{item.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="notification-footer">
            <a href="/dashboard/tasks" className="btn btn-sm btn-primary w-100">View all reminders</a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
