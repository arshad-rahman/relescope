import type {
  Commit,
} from "../types/github";


export type AdvancedCommitRange =
  | "all"
  | "7d"
  | "14d"
  | "30d"
  | "custom";


export const advancedCommitRangeOptions = [
  {
    value: "all",
    label: "All loaded commits",
  },
  {
    value: "7d",
    label: "Last 7 days",
  },
  {
    value: "14d",
    label: "Last 14 days",
  },
  {
    value: "30d",
    label: "Last 30 days",
  },
  {
    value: "custom",
    label: "Custom date range",
  },
] satisfies Array<{
  value: AdvancedCommitRange;
  label: string;
}>;


export function isAdvancedCommitRange(
  value: string | null,
): value is AdvancedCommitRange {
  return [
    "all",
    "7d",
    "14d",
    "30d",
    "custom",
  ].includes(value ?? "");
}


function getCommitTimestamp(
  commit: Commit,
): number {
  const timestamp =
    Date.parse(commit.date);

  return Number.isFinite(timestamp)
    ? timestamp
    : 0;
}


function getDateBoundary(
  value: string,
  endOfDay: boolean,
): number | null {
  if (!value) {
    return null;
  }

  const timestamp =
    Date.parse(
      value +
      (
        endOfDay
          ? "T23:59:59.999Z"
          : "T00:00:00.000Z"
      ),
    );

  return Number.isFinite(timestamp)
    ? timestamp
    : null;
}


export function filterCommitsByAdvancedRange(
  commits: Commit[],
  range: AdvancedCommitRange,
  dateFrom: string,
  dateTo: string,
  now = new Date(),
): Commit[] {
  const sortedCommits = [
    ...commits,
  ].sort(
    (commitA, commitB) =>
      getCommitTimestamp(commitB) -
      getCommitTimestamp(commitA),
  );

  if (range === "all") {
    return sortedCommits;
  }

  if (range === "custom") {
    const fromTimestamp =
      getDateBoundary(
        dateFrom,
        false,
      );

    const toTimestamp =
      getDateBoundary(
        dateTo,
        true,
      );

    return sortedCommits.filter(
      (commit) => {
        const timestamp =
          getCommitTimestamp(commit);

        return (
          timestamp > 0 &&
          (
            fromTimestamp === null ||
            timestamp >= fromTimestamp
          ) &&
          (
            toTimestamp === null ||
            timestamp <= toTimestamp
          )
        );
      },
    );
  }

  const days =
    range === "7d"
      ? 7
      : range === "14d"
        ? 14
        : 30;

  const cutoffTimestamp =
    now.getTime() -
    days * 24 * 60 * 60 * 1000;

  return sortedCommits.filter(
    (commit) => {
      const timestamp =
        getCommitTimestamp(commit);

      return (
        timestamp > 0 &&
        timestamp >= cutoffTimestamp
      );
    },
  );
}
