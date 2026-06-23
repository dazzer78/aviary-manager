export const EGG_EVENT_TYPES = [
  "egg_created",
  "hatched",
  "ringed",
  "not_fertilised",
  "broken",
  "abandoned",
  "dead_in_shell",
  "dead_before_ringing",
] as const;

export type EggEventType = (typeof EGG_EVENT_TYPES)[number];

export type EggStatus =
  | "Incubating"
  | "Hatched"
  | "Ringed"
  | "Not Fertilised"
  | "Broken"
  | "Abandoned"
  | "Dead In Shell"
  | "Dead Before Ringing";

export type EggEvent = {
  id?: string;
  egg_id: string;
  event_type: EggEventType;
  event_date: string;
  notes?: string | null;
  created_at?: string;
};

const EVENT_STATUS_PRIORITY: Record<EggEventType, number> = {
  egg_created: 0,
  not_fertilised: 10,
  broken: 20,
  abandoned: 30,
  dead_in_shell: 40,
  hatched: 50,
  dead_before_ringing: 60,
  ringed: 70,
};

const EVENT_STATUS_LABEL: Record<EggEventType, EggStatus> = {
  egg_created: "Incubating",
  hatched: "Hatched",
  ringed: "Ringed",
  not_fertilised: "Not Fertilised",
  broken: "Broken",
  abandoned: "Abandoned",
  dead_in_shell: "Dead In Shell",
  dead_before_ringing: "Dead Before Ringing",
};

export function getCurrentEggStatus(events: EggEvent[]): EggStatus {
  if (events.length === 0) {
    return "Incubating";
  }

  const latestLifecycleEvent = [...events].sort((a, b) => {
    const priorityDifference =
      EVENT_STATUS_PRIORITY[b.event_type] - EVENT_STATUS_PRIORITY[a.event_type];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    const bDate = new Date(b.created_at ?? b.event_date).getTime();
    const aDate = new Date(a.created_at ?? a.event_date).getTime();

    return bDate - aDate;
  })[0];

  return EVENT_STATUS_LABEL[latestLifecycleEvent.event_type];
}

export function getAvailableEggActions(status: EggStatus): EggEventType[] {
  switch (status) {
    case "Incubating":
      return [
        "hatched",
        "not_fertilised",
        "broken",
        "abandoned",
        "dead_in_shell",
      ];
    case "Hatched":
      return ["ringed", "dead_before_ringing"];
    default:
      return [];
  }
}

export function isEggStatusSystemManaged(): true {
  return true;
}

export const EGG_ACTION_LABEL: Record<EggEventType, string> = {
  egg_created: "Create Egg",
  hatched: "Hatch Egg",
  ringed: "Ring Chick",
  not_fertilised: "Mark Clear / Not Fertilised",
  broken: "Mark Broken",
  abandoned: "Mark Abandoned",
  dead_in_shell: "Mark Dead In Shell",
  dead_before_ringing: "Record Death Before Ringing",
};
