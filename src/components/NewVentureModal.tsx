"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { ActionButton } from "../../design-system/components/decisions/DecisionRow.jsx";
import { DropZone } from "../../design-system/components/docs/FileRow.jsx";
import { SwatchPicker } from "../../design-system/components/forms/SwatchPicker.jsx";
import { AvatarPicker } from "../../design-system/components/media/Avatar.jsx";
import { TextField } from "../../design-system/components/forms/TextField.jsx";
import { Modal } from "../../design-system/components/overlay/Modal.jsx";
import { createVentureAction } from "@/lib/ventures/actions";
import { AVATAR_KEYS, DEFAULT_AVATAR } from "@/lib/avatars";

const NewVentureContext = createContext<{ open: () => void } | null>(null);

export function useNewVenture() {
  const ctx = useContext(NewVentureContext);
  if (!ctx) {
    throw new Error("useNewVenture must be used within NewVentureProvider");
  }
  return ctx;
}

export function NewVentureProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        openModal();
      } else if (e.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openModal, closeModal]);

  return (
    <NewVentureContext.Provider value={{ open: openModal }}>
      {children}
      {open ? <NewVentureModal onClose={closeModal} /> : null}
    </NewVentureContext.Provider>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) {
    const kb = n / 1024;
    return `${kb < 10 ? kb.toFixed(1) : Math.round(kb)} KB`;
  }
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function NewVentureModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [line, setLine] = useState("");
  const [founder, setFounder] = useState("");
  const [founderEmail, setFounderEmail] = useState("");
  const [founderAvatar, setFounderAvatar] = useState(DEFAULT_AVATAR);
  const [color, setColor] = useState("var(--copper)");
  const [deck, setDeck] = useState<File | null>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const takeFile = (file: File | undefined) => {
    if (!file) return;
    setDeck(file);
    setError(null);
  };

  const create = () => {
    if (pending) return;
    if (!name.trim()) {
      setError("A name is required.");
      return;
    }
    setError(null);
    const form = new FormData();
    form.set("name", name.trim());
    form.set("oneLiner", line);
    form.set("founderName", founder);
    form.set("founderEmail", founderEmail);
    form.set("founderAvatar", founderAvatar);
    form.set("color", color);
    if (deck) form.set("deck", deck);
    startTransition(async () => {
      const result = await createVentureAction(form);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      onClose();
      router.refresh();
    });
  };

  return (
    <Modal
      eyebrow="New venture"
      title="Add a venture to the pipeline"
      onClose={onClose}
      width={520}
      footer={
        <>
          <ActionButton onClick={create}>
            {pending ? "Adding…" : "Add to pipeline"}
          </ActionButton>
          <span style={{ fontSize: 11.5, color: error ? "var(--amber)" : "var(--faint)" }}>
            {error ??
              "Lands in Application. Drag it to Meet when you set a meeting."}
          </span>
        </>
      }
    >
      <TextField
        label="Name"
        value={name}
        onChange={setName}
        placeholder="ImmiClaw"
        autoFocus
      />
      <TextField
        label="One-liner"
        value={line}
        onChange={setLine}
        multiline
        optional
        placeholder="Study abroad automation for agents across West Africa"
      />
      <TextField
        label="Founder"
        value={founder}
        onChange={setFounder}
        placeholder="Tunde Adeyemi"
        optional
      />
      <TextField
        label="Founder email"
        value={founderEmail}
        onChange={setFounderEmail}
        placeholder="tunde@immiclaw.com"
        optional
      />
      <AvatarPicker
        label="Founder avatar"
        note="How they show on the board"
        keys={AVATAR_KEYS}
        value={founderAvatar}
        onChange={setFounderAvatar}
      />
      <SwatchPicker
        value={color}
        onChange={setColor}
        note="Themes this venture everywhere"
      />
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
          active={Boolean(deck) || drag}
          onClick={() => {
            if (deck) {
              setDeck(null);
              return;
            }
            inputRef.current?.click();
          }}
          label={
            deck ? `${deck.name} · ${formatBytes(deck.size)}` : "Drop the deck"
          }
          hint={
            deck
              ? "Click to remove · attaches to the venture on engage"
              : "or click to browse · PDF or PPTX · optional"
          }
        />
        <input
          ref={inputRef}
          type="file"
          hidden
          accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
          onChange={(e) => {
            takeFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
    </Modal>
  );
}
