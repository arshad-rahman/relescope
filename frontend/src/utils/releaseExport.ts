import type { ReleaseNotes } from "../types/release";

type ReleaseSection = {
  heading: string;
  items: string[];
};

function getSections(
  releaseNotes: ReleaseNotes,
): ReleaseSection[] {
  return [
    {
      heading: "Features",
      items: releaseNotes.features,
    },
    {
      heading: "Bug Fixes",
      items: releaseNotes.fixes,
    },
    {
      heading: "Improvements",
      items: releaseNotes.improvements,
    },
    {
      heading: "Documentation",
      items: releaseNotes.documentation,
    },
    {
      heading: "Maintenance",
      items: releaseNotes.maintenance,
    },
  ];
}

function sanitizeFilename(value: string): string {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return cleaned || "release-notes";
}

function downloadBlob(
  content: string,
  filename: string,
  type: string,
): void {
  const blob = new Blob([content], {
    type,
  });

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = objectUrl;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(objectUrl);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function releaseNotesToMarkdown(
  releaseNotes: ReleaseNotes,
): string {
  const lines: string[] = [
    `# ${releaseNotes.title}`,
    "",
    releaseNotes.summary,
    "",
    `**Total commits:** ${releaseNotes.totalCommits}`,
    "",
  ];

  for (const section of getSections(releaseNotes)) {
    if (section.items.length === 0) {
      continue;
    }

    lines.push(`## ${section.heading}`);
    lines.push("");

    for (const item of section.items) {
      lines.push(`- ${item}`);
    }

    lines.push("");
  }

  if (releaseNotes.contributors.length > 0) {
    lines.push("## Contributors");
    lines.push("");

    for (const contributor of releaseNotes.contributors) {
      lines.push(`- ${contributor}`);
    }

    lines.push("");
  }

  return lines.join("\n").trim() + "\n";
}

export async function copyReleaseMarkdown(
  releaseNotes: ReleaseNotes,
): Promise<void> {
  const markdown =
    releaseNotesToMarkdown(releaseNotes);

  if (
    navigator.clipboard &&
    window.isSecureContext
  ) {
    await navigator.clipboard.writeText(markdown);
    return;
  }

  const textarea =
    document.createElement("textarea");

  textarea.value = markdown;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  const copied =
    document.execCommand("copy");

  textarea.remove();

  if (!copied) {
    throw new Error(
      "The browser could not copy the release notes.",
    );
  }
}

export function downloadReleaseMarkdown(
  releaseNotes: ReleaseNotes,
): void {
  downloadBlob(
    releaseNotesToMarkdown(releaseNotes),
    `${sanitizeFilename(releaseNotes.title)}.md`,
    "text/markdown;charset=utf-8",
  );
}

export function downloadReleaseJson(
  releaseNotes: ReleaseNotes,
): void {
  downloadBlob(
    JSON.stringify(releaseNotes, null, 2),
    `${sanitizeFilename(releaseNotes.title)}.json`,
    "application/json;charset=utf-8",
  );
}

export function printReleaseNotes(
  releaseNotes: ReleaseNotes,
): void {
  const printWindow = window.open(
    "",
    "_blank",
    "width=900,height=700",
  );

  if (!printWindow) {
    throw new Error(
      "The browser blocked the print window. Allow pop-ups and try again.",
    );
  }

  const sections = getSections(releaseNotes)
    .filter((section) => section.items.length > 0)
    .map(
      (section) => `
        <section>
          <h2>${escapeHtml(section.heading)}</h2>
          <ul>
            ${section.items
              .map(
                (item) =>
                  `<li>${escapeHtml(item)}</li>`,
              )
              .join("")}
          </ul>
        </section>
      `,
    )
    .join("");

  const contributors =
    releaseNotes.contributors.length > 0
      ? `
        <section>
          <h2>Contributors</h2>
          <ul>
            ${releaseNotes.contributors
              .map(
                (contributor) =>
                  `<li>${escapeHtml(contributor)}</li>`,
              )
              .join("")}
          </ul>
        </section>
      `
      : "";

  printWindow.document.write(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />

        <title>${escapeHtml(releaseNotes.title)}</title>

        <style>
          @page {
            margin: 20mm;
          }

          * {
            box-sizing: border-box;
          }

          body {
            max-width: 850px;
            margin: 0 auto;
            color: #172033;
            font-family:
              Arial,
              Helvetica,
              sans-serif;
            font-size: 14px;
            line-height: 1.6;
          }

          header {
            padding-bottom: 20px;
            border-bottom: 1px solid #d9dee8;
          }

          h1 {
            margin: 0;
            font-size: 30px;
            line-height: 1.2;
          }

          h2 {
            margin: 28px 0 10px;
            font-size: 17px;
          }

          p {
            margin: 12px 0 0;
            color: #4a5568;
          }

          .meta {
            margin-top: 12px;
            color: #667085;
            font-size: 12px;
          }

          ul {
            margin: 0;
            padding-left: 22px;
          }

          li {
            margin-bottom: 7px;
          }

          section {
            break-inside: avoid;
          }
        </style>
      </head>

      <body>
        <header>
          <h1>${escapeHtml(releaseNotes.title)}</h1>

          <p>
            ${escapeHtml(releaseNotes.summary)}
          </p>

          <div class="meta">
            ${releaseNotes.totalCommits}
            ${
              releaseNotes.totalCommits === 1
                ? "commit"
                : "commits"
            }
          </div>
        </header>

        ${sections}
        ${contributors}

        <script>
          window.addEventListener("load", () => {
            window.print();
          });
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}
