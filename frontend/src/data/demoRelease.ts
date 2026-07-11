export const repository = {
  owner: "acme-inc",
  repo: "api-service",
  branch: "main",
  commits: 486,
  pullRequests: 27,
  contributors: 14,
};

export const processing = [
  {
    title: "Scanning Git history",
    status: "done",
  },
  {
    title: "Grouping commits",
    status: "done",
  },
  {
    title: "Detecting Features",
    status: "done",
  },
  {
    title: "Finding Bug Fixes",
    status: "done",
  },
  {
    title: "Generating Release Notes",
    status: "running",
  },
];

export const releaseNotes = {
  version: "v2.8.0",
  date: "July 2026",

  features: [
    "Added team workspace permissions",
    "Introduced project tagging",
    "Export release notes as Markdown",
  ],

  fixes: [
    "Fixed OAuth callback issue",
    "Resolved duplicate notification bug",
  ],

  improvements: [
    "Improved dashboard performance",
    "Reduced API response latency",
  ],
};
