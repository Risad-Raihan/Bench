"use client";

import Image from "next/image";
import { upload } from "@vercel/blob/client";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { FactRow } from "../../design-system/components/data/FactRow.jsx";
import { ActionButton } from "../../design-system/components/decisions/DecisionRow.jsx";
import {
  DocsHeaderRow,
  DropZone,
  FileRow,
  FolderFilter,
  PreviewPanel,
  VersionRow,
} from "../../design-system/components/docs/FileRow.jsx";
import { TextField } from "../../design-system/components/forms/TextField.jsx";
import { EmptyState } from "../../design-system/components/layout/Panel.jsx";
import { Modal } from "../../design-system/components/overlay/Modal.jsx";
import { FilterBar } from "../../design-system/components/work/TaskRow.jsx";
import { Archive, Download, FolderOpen, Upload } from "lucide-react";
import {
  archiveDocAction,
  completeDocUploadAction,
} from "@/lib/docs/actions";

export type DocsTabVersion = {
  id: string;
  version: number;
  who: string;
  date: string;
};

export type DocsTabFile = {
  id: string;
  name: string;
  type: string;
  mimeType: string;
  size: string;
  who: string;
  date: string;
  folder: string | null;
  visibility: "studio" | "shared";
  versionCount: number;
  versions: DocsTabVersion[];
};

const ALL = "All";
const UNFILED = "Unfiled";

function foldersFrom(files: DocsTabFile[]) {
  const counts = new Map<string, number>();
  let unfiled = 0;
  for (const file of files) {
    if (file.folder) counts.set(file.folder, (counts.get(file.folder) ?? 0) + 1);
    else unfiled += 1;
  }
  return [
    { label: ALL, count: files.length },
    ...[...counts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, count]) => ({ label, count })),
    { label: UNFILED, count: unfiled },
  ];
}

function previewable(mime: string) {
  return mime === "application/pdf" || mime.startsWith("image/");
}

function safeName(name: string) {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 120) || "file";
}

export function DocsView({
  slug,
  ventureId,
  files,
  sharedOnly = false,
}: {
  slug: string;
  ventureId: string;
  files: DocsTabFile[];
  sharedOnly?: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const versionInputRef = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState(ALL);
  const [sel, setSel] = useState<string | null>(files[0]?.id ?? null);
  const [open, setOpen] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<{
    file: File;
    folder: string;
    visibility: "studio" | "shared";
  } | null>(null);

  const selected = files.find((f) => f.id === sel) ?? null;
  const rows =
    folder === ALL
      ? files
      : folder === UNFILED
        ? files.filter((f) => f.folder == null)
        : files.filter((f) => f.folder === folder);

  const takeFile = (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setDraft({
      file,
      folder: folder !== ALL && folder !== UNFILED ? folder : "",
      visibility: sharedOnly ? "shared" : "studio",
    });
  };

  const runUpload = (
    file: File,
    opts: {
      folder: string | null;
      visibility: "studio" | "shared";
      supersedesId?: string;
    },
  ) => {
    startTransition(async () => {
      setError(null);
      try {
        const pathname = `ventures/${ventureId}/${crypto.randomUUID()}/${safeName(file.name)}`;
        const payload = {
          ventureId,
          folder: opts.folder,
          visibility: opts.visibility,
          supersedesId: opts.supersedesId ?? null,
          name: file.name.slice(0, 200),
        };
        const blob = await upload(pathname, file, {
          access: "private",
          handleUploadUrl: "/api/docs/upload",
          clientPayload: JSON.stringify(payload),
          contentType: file.type || undefined,
        });
        const result = await completeDocUploadAction({
          url: blob.url,
          contentType: blob.contentType,
          sizeBytes: file.size,
          ventureId,
          folder: opts.folder,
          visibility: opts.visibility,
          supersedesId: opts.supersedesId ?? null,
          name: file.name.slice(0, 200),
          slug,
        });
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setDraft(null);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      }
    });
  };

  const onArchive = () => {
    if (!selected) return;
    startTransition(async () => {
      const result = await archiveDocAction({ docId: selected.id, slug });
      if (!result.ok) setError(result.error);
      else {
        setSel(null);
        router.refresh();
      }
    });
  };

  const empty = files.length === 0;
  const folders = foldersFrom(files);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "172px 1fr 260px" }}>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(e) => {
          takeFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={versionInputRef}
        type="file"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file || !selected) return;
          runUpload(file, {
            folder: selected.folder,
            visibility: selected.visibility,
            supersedesId: selected.id,
          });
        }}
      />
      <FolderFilter folders={folders} active={folder} onSelect={setFolder} />
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          takeFile(e.dataTransfer.files[0]);
        }}
      >
        <DropZone
          active={drag || pending}
          onClick={() => inputRef.current?.click()}
        />
        {error && (
          <div
            style={{
              padding: "0 16px 10px",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--amber)",
            }}
          >
            {error}
          </div>
        )}
        {empty ? (
          <div style={{ padding: "8px 16px 16px" }}>
            <EmptyState icon={FolderOpen} hint="Drop a file above. Docs from an engaged application land here automatically.">
              No docs in this venture yet
            </EmptyState>
          </div>
        ) : (
          <>
            <DocsHeaderRow />
            {rows.map((file) => (
              <div key={file.id}>
                <FileRow
                  name={file.name}
                  type={file.type}
                  size={file.size}
                  who={file.who}
                  date={file.date}
                  versions={file.versionCount}
                  on={file.id === sel}
                  expanded={open === file.id}
                  onClick={() => setSel(file.id)}
                  onExpand={() =>
                    setOpen((id) => (id === file.id ? null : file.id))
                  }
                />
                {open === file.id &&
                  file.versions.map((v) => (
                    <VersionRow
                      key={v.id}
                      version={v.version}
                      who={v.who}
                      date={v.date}
                    />
                  ))}
              </div>
            ))}
          </>
        )}
      </div>
      {selected ? (
        <PreviewPanel
          name={selected.name}
          type={selected.type}
          onClose={() => setSel(null)}
          meta={
            <div style={{ marginTop: 12 }}>
              <FactRow k="Size" v={selected.size} mono />
              <FactRow k="Uploaded" v={`${selected.who} · ${selected.date}`} />
              <FactRow k="Versions" v={String(selected.versionCount)} mono />
              <FactRow k="Folder" v={selected.folder ?? UNFILED} />
              <FactRow
                k="Visibility"
                v={selected.visibility === "shared" ? "Shared" : "Studio"}
              />
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 14,
                  flexWrap: "wrap",
                }}
              >
                <ActionButton
                  icon={Upload}
                  onClick={() => versionInputRef.current?.click()}
                >
                  Upload new version
                </ActionButton>
                <a
                  href={`/api/docs/${selected.id}/download?dl=1`}
                  style={{ textDecoration: "none" }}
                >
                  <ActionButton icon={Download}>Download</ActionButton>
                </a>
                {sharedOnly ? null : (
                  <ActionButton icon={Archive} onClick={onArchive}>Archive</ActionButton>
                )}
              </div>
            </div>
          }
        >
          {previewable(selected.mimeType) ? (
            selected.mimeType.startsWith("image/") ? (
              <Image
                src={`/api/docs/${selected.id}/download`}
                alt={selected.name}
                width={230}
                height={210}
                unoptimized
                style={{ maxWidth: "100%", maxHeight: 210, objectFit: "contain" }}
              />
            ) : (
              <iframe
                title={selected.name}
                src={`/api/docs/${selected.id}/download`}
                style={{ width: "100%", height: 210, border: 0 }}
              />
            )
          ) : (
            "No inline preview for this type"
          )}
        </PreviewPanel>
      ) : (
        <div
          style={{
            borderLeft: "1px solid var(--line)",
            background: "var(--bg2)",
            minHeight: 420,
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: "var(--ink-ghost)",
          }}
        >
          Select a file
        </div>
      )}
      {draft && (
        <Modal
          eyebrow="Upload"
          title={draft.file.name}
          onClose={() => setDraft(null)}
          width={420}
          footer={
            <>
              <ActionButton
                icon={Upload}
                onClick={() => {
                  if (pending) return;
                  runUpload(draft.file, {
                    folder: draft.folder.trim() || null,
                    visibility: draft.visibility,
                  });
                }}
              >
                {pending ? "Uploading" : "Upload"}
              </ActionButton>
              <span
                style={{
                  fontSize: 11.5,
                  color: error ? "var(--amber)" : "var(--faint)",
                }}
              >
                {error ??
                  (sharedOnly
                    ? "Lands in this venture as shared."
                    : "Lands in this venture. Studio until you share it.")}
              </span>
            </>
          }
        >
          <TextField
            label="Folder"
            value={draft.folder}
            onChange={(v: string) => setDraft({ ...draft, folder: v })}
            placeholder="Diligence"
            optional
          />
          <div style={{ marginBottom: 4 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: "var(--faint)",
                marginBottom: 6,
              }}
            >
              Visibility
            </div>
            {sharedOnly ? (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "var(--dim)",
                  padding: "6px 0",
                }}
              >
                Shared
              </div>
            ) : (
              <FilterBar
                filters={["Studio", "Shared"]}
                active={draft.visibility === "shared" ? "Shared" : "Studio"}
                onSelect={(f: string) =>
                  setDraft({
                    ...draft,
                    visibility: f === "Shared" ? "shared" : "studio",
                  })
                }
              />
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
