import type {
  Commit,
} from "../types/github";

export type LiteReleaseRange =
  | "7d"
  | "14d"
  | "30d"
  | "10c"
  | "25c";

export type LiteRangeOption = {
  value: LiteReleaseRange;
  title: string;
  description: string;
  type: "days" | "commits";
};

export const liteRangeOptions: LiteRangeOption[] = [
  {
    value: "7d",
    title: "Last 7 days",
    description:
      "Best for weekly releases and sprint summaries.",
    type: "days",
  },
  {
    value: "14d",
    title: "Last 14 days",
    description:
      "Capture work completed across two weeks.",
    type: "days",
  },
  {
    value: "30d",
    title: "Last 30 days",
    description:
      "Create a broader monthly release summary.",
    type: "days",
  },
  {
    value: "10c",
    title: "Latest 10 commits",
    description:
      "Use the ten most recent commits on the branch.",
    type: "commits",
  },
  {
    value: "25c",
    title: "Latest 25 commits",
    description:
      "Include a larger set of recent repository changes.",
    type: "commits",
  },
];

function getCommitTimestamp(
  commit: Commit,
): number {
  const timestamp =
    Date.parse(commit.date);

  return Number.isFinite(timestamp)
    ? timestamp
    : 0;
}

function normalizeContributorIdentity(
  author: string,
  email: string,
): string {
  const normalizedName = author
    .trim()
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[\s._-]+/g, "");

  if (normalizedName) {
    return `name:${normalizedName}`;
  }

  return `email:${email
    .trim()
    .toLocaleLowerCase()}`;
}

export function getLiteRangeLabel(
  range: LiteReleaseRange,
): string {
  switch (range) {
    case "7d":
      return "Last 7 days";

    case "14d":
      return "Last 14 days";

    case "30d":
      return "Last 30 days";

    case "10c":
      return "Latest 10 commits";

    case "25c":
      return "Latest 25 commits";
  }
}

export function suggestLiteReleaseTitle(
  range: LiteReleaseRange,
): string {
  switch (range) {
    case "7d":
      return "Weekly Release";

    case "14d":
      return "Biweekly Release";

    case "30d":
      return "Monthly Release";

    case "10c":
      return "Latest Changes Release";

    case "25c":
      return "Recent Development Release";
  }
}

export function selectCommitsForLiteRange(
  commits: Commit[],
  range: LiteReleaseRange,
  now = new Date(),
): Commit[] {
  const sortedCommits = [...commits].sort(
    (commitA, commitB) =>
      getCommitTimestamp(commitB) -
      getCommitTimestamp(commitA),
  );

  if (range === "10c") {
    return sortedCommits.slice(0, 10);
  }

  if (range === "25c") {
    return sortedCommits.slice(0, 25);
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

  return sortedCommits.filter((commit) => {
    const timestamp =
      getCommitTimestamp(commit);

    return (
      timestamp > 0 &&
      timestamp >= cutoffTimestamp
    );
  });
}

export function getLiteContributors(
  commits: Commit[],
): string[] {
  const groups = new Map<
    string,
    Map<string, number>
  >();

  for (const commit of commits) {
    const displayName =
      commit.author.trim() ||
      commit.authorEmail.trim() ||
      "Unknown contributor";

    const identity =
      normalizeContributorIdentity(
        commit.author,
        commit.authorEmail,
      );

    const variants =
      groups.get(identity) ??
      new Map<string, number>();

    variants.set(
      displayName,
      (variants.get(displayName) ?? 0) + 1,
    );

    groups.set(identity, variants);
  }

  return Array.from(groups.values())
    .map((variants) => {
      return (
        Array.from(variants.entries())
          .sort(
            (
              [nameA, countA],
              [nameB, countB],
            ) =>
              countB - countA ||
              nameA.localeCompare(nameB),
          )[0]?.[0] ??
        "Unknown contributor"
      );
    })
    .sort((nameA, nameB) =>
      nameA.localeCompare(nameB),
    );
}

export function formatLiteCommitDate(
  value: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}
