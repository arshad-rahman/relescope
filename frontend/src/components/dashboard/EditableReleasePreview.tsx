import {
  useEffect,
  useState,
} from "react";

import {
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  X,
} from "lucide-react";

import ReleasePreview from "./ReleasePreview";

import type {
  ReleaseNotes,
} from "../../types/release";

type Props = {
  releaseNotes: ReleaseNotes | null;
  onChange: (releaseNotes: ReleaseNotes) => void;
};

type ListField =
  | "features"
  | "fixes"
  | "improvements"
  | "documentation"
  | "maintenance";

type EditableSectionProps = {
  title: string;
  field: ListField;
  items: string[];
  onItemChange: (
    field: ListField,
    index: number,
    value: string,
  ) => void;
  onItemAdd: (field: ListField) => void;
  onItemDelete: (
    field: ListField,
    index: number,
  ) => void;
};

function cloneReleaseNotes(
  releaseNotes: ReleaseNotes,
): ReleaseNotes {
  return {
    ...releaseNotes,
    features: [...releaseNotes.features],
    fixes: [...releaseNotes.fixes],
    improvements: [
      ...releaseNotes.improvements,
    ],
    documentation: [
      ...releaseNotes.documentation,
    ],
    maintenance: [
      ...releaseNotes.maintenance,
    ],
    contributors: [
      ...releaseNotes.contributors,
    ],
  };
}

function EditableSection({
  title,
  field,
  items,
  onItemChange,
  onItemAdd,
  onItemDelete,
}: EditableSectionProps) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/40 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">
          {title}
        </h3>

        <button
          type="button"
          onClick={() => onItemAdd(field)}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">
          No items in this section.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={`${field}-${index}`}
              className="flex items-start gap-2"
            >
              <textarea
                value={item}
                rows={2}
                onChange={(event) =>
                  onItemChange(
                    field,
                    index,
                    event.target.value,
                  )
                }
                className="min-h-20 flex-1 resize-y rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
              />

              <button
                type="button"
                onClick={() =>
                  onItemDelete(field, index)
                }
                aria-label={`Delete ${title} item ${index + 1}`}
                className="rounded-lg border border-red-400/15 bg-red-400/[0.06] p-3 text-red-300 transition hover:bg-red-400/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function EditableReleasePreview({
  releaseNotes,
  onChange,
}: Props) {
  const [isEditing, setIsEditing] =
    useState(false);

  const [draft, setDraft] =
    useState<ReleaseNotes | null>(null);

  const [original, setOriginal] =
    useState<ReleaseNotes | null>(null);

  useEffect(() => {
    if (!releaseNotes) {
      setDraft(null);
      setOriginal(null);
      setIsEditing(false);
      return;
    }

    setDraft(cloneReleaseNotes(releaseNotes));
    setOriginal(cloneReleaseNotes(releaseNotes));
    setIsEditing(false);
  }, [releaseNotes]);

  if (!releaseNotes || !draft) {
    return (
      <ReleasePreview
        releaseNotes={releaseNotes}
      />
    );
  }

  function beginEditing() {
    if (!releaseNotes) {
      return;
    }

    const snapshot =
      cloneReleaseNotes(releaseNotes);

    setOriginal(snapshot);
    setDraft(cloneReleaseNotes(snapshot));
    setIsEditing(true);
  }

  function cancelEditing() {
    const source =
      original ?? releaseNotes;

    if (!source) {
      return;
    }

    setDraft(
      cloneReleaseNotes(source),
    );

    setIsEditing(false);
  }

  function resetDraft() {
    const source =
      original ?? releaseNotes;

    if (!source) {
      return;
    }

    setDraft(
      cloneReleaseNotes(source),
    );
  }

  function saveDraft() {
    if (!draft) {
      return;
    }

    const cleanedDraft: ReleaseNotes = {
      ...draft,
      title: draft.title.trim(),
      summary: draft.summary.trim(),

      features: draft.features
        .map((item) => item.trim())
        .filter(Boolean),

      fixes: draft.fixes
        .map((item) => item.trim())
        .filter(Boolean),

      improvements: draft.improvements
        .map((item) => item.trim())
        .filter(Boolean),

      documentation: draft.documentation
        .map((item) => item.trim())
        .filter(Boolean),

      maintenance: draft.maintenance
        .map((item) => item.trim())
        .filter(Boolean),

      contributors: draft.contributors
        .map((item) => item.trim())
        .filter(Boolean),
    };

    if (!cleanedDraft.title) {
      return;
    }

    onChange(cleanedDraft);
    setOriginal(cloneReleaseNotes(cleanedDraft));
    setDraft(cloneReleaseNotes(cleanedDraft));
    setIsEditing(false);
  }

  function updateField(
    field: "title" | "summary",
    value: string,
  ) {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        [field]: value,
      };
    });
  }

  function updateItem(
    field: ListField,
    index: number,
    value: string,
  ) {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft;
      }

      const nextItems = [
        ...currentDraft[field],
      ];

      nextItems[index] = value;

      return {
        ...currentDraft,
        [field]: nextItems,
      };
    });
  }

  function addItem(field: ListField) {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        [field]: [
          ...currentDraft[field],
          "",
        ],
      };
    });
  }

  function deleteItem(
    field: ListField,
    index: number,
  ) {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        [field]: currentDraft[field].filter(
          (_, itemIndex) =>
            itemIndex !== index,
        ),
      };
    });
  }

  function updateContributors(
    value: string,
  ) {
    setDraft((currentDraft) => {
      if (!currentDraft) {
        return currentDraft;
      }

      return {
        ...currentDraft,
        contributors: value
          .split(",")
          .map((item) => item.trim()),
      };
    });
  }

  if (!isEditing) {
    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={beginEditing}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] px-4 py-3 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/[0.12]"
        >
          <Pencil className="h-4 w-4" />
          Edit generated release
        </button>

        <ReleasePreview
          releaseNotes={releaseNotes}
        />
      </div>
    );
  }

  return (
    <div className="h-fit rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-6 shadow-2xl">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Release editor
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Review and refine
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Edit the AI-generated content before
            exporting or saving it.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetDraft}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>

          <button
            type="button"
            onClick={cancelEditing}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>

          <button
            type="button"
            onClick={saveDraft}
            disabled={!draft.title.trim()}
            className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            Save edits
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <label
            htmlFor="release-editor-title"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Release title
          </label>

          <input
            id="release-editor-title"
            value={draft.title}
            onChange={(event) =>
              updateField(
                "title",
                event.target.value,
              )
            }
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
          />
        </div>

        <div>
          <label
            htmlFor="release-editor-summary"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Summary
          </label>

          <textarea
            id="release-editor-summary"
            value={draft.summary}
            rows={5}
            onChange={(event) =>
              updateField(
                "summary",
                event.target.value,
              )
            }
            className="w-full resize-y rounded-xl border border-white/10 bg-slate-950 px-4 py-3 leading-7 text-white outline-none transition focus:border-cyan-500"
          />
        </div>

        <EditableSection
          title="Features"
          field="features"
          items={draft.features}
          onItemChange={updateItem}
          onItemAdd={addItem}
          onItemDelete={deleteItem}
        />

        <EditableSection
          title="Bug fixes"
          field="fixes"
          items={draft.fixes}
          onItemChange={updateItem}
          onItemAdd={addItem}
          onItemDelete={deleteItem}
        />

        <EditableSection
          title="Improvements"
          field="improvements"
          items={draft.improvements}
          onItemChange={updateItem}
          onItemAdd={addItem}
          onItemDelete={deleteItem}
        />

        <EditableSection
          title="Documentation"
          field="documentation"
          items={draft.documentation}
          onItemChange={updateItem}
          onItemAdd={addItem}
          onItemDelete={deleteItem}
        />

        <EditableSection
          title="Maintenance"
          field="maintenance"
          items={draft.maintenance}
          onItemChange={updateItem}
          onItemAdd={addItem}
          onItemDelete={deleteItem}
        />

        <div>
          <label
            htmlFor="release-editor-contributors"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Contributors
          </label>

          <input
            id="release-editor-contributors"
            value={draft.contributors.join(", ")}
            onChange={(event) =>
              updateContributors(
                event.target.value,
              )
            }
            placeholder="Contributor One, Contributor Two"
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500"
          />

          <p className="mt-2 text-xs text-slate-500">
            Separate contributor names with commas.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
          Commit count remains unchanged:{" "}
          <span className="font-semibold text-white">
            {draft.totalCommits}
          </span>
        </div>
      </div>
    </div>
  );
}
