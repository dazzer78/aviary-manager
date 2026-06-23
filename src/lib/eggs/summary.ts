import { EggEvent, EggStatus, getCurrentEggStatus } from "./lifecycle";

export type EggWithEvents = {
  id: string;
  events?: EggEvent[];
};

export type EggStatusSummary = Partial<Record<EggStatus, number>> & {
  total: number;
};

export function getEggStatusSummary(eggs: EggWithEvents[]): EggStatusSummary {
  return eggs.reduce<EggStatusSummary>(
    (summary, egg) => {
      const status = getCurrentEggStatus(egg.events ?? []);
      summary.total += 1;
      summary[status] = (summary[status] ?? 0) + 1;
      return summary;
    },
    { total: 0 },
  );
}

export function formatEggStatusSummary(summary: EggStatusSummary): string[] {
  const orderedStatuses: EggStatus[] = [
    "Ringed",
    "Hatched",
    "Incubating",
    "Not Fertilised",
    "Broken",
    "Abandoned",
    "Dead In Shell",
    "Dead Before Ringing",
  ];

  return orderedStatuses
    .filter((status) => (summary[status] ?? 0) > 0)
    .map((status) => `${summary[status]} ${status}`);
}
