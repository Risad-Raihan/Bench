/**
 * One-line copy for an activity row. Feeds are scannable history, not
 * content — keep this to a single sentence the ActivityRow can truncate.
 */
import { isStage, stageLabel } from "@/lib/pipeline-stages";

export type ActivityCopyInput = {
  verb: string;
  entity: string;
  ventureName: string | null;
  payload: Record<string, unknown> | null;
};

function payloadString(
  payload: Record<string, unknown>,
  key: string,
): string | null {
  const value = payload[key];
  return typeof value === "string" && value.length > 0 ? value : null;
}

function stageName(value: unknown): string | null {
  return typeof value === "string" && isStage(value) ? stageLabel(value) : null;
}

export function formatActivityText(input: ActivityCopyInput): string {
  const payload = input.payload ?? {};
  const venture = input.ventureName ?? "a venture";
  const from = stageName(payload.fromStage);
  const to = stageName(payload.toStage);

  switch (input.verb) {
    case "created":
      if (input.entity === "venture") return `Created ${venture}`;
      if (input.entity === "task") return "Created a task";
      if (input.entity === "note") return "Added a note";
      if (input.entity === "doc") return "Uploaded a doc";
      if (input.entity === "decision") return "Logged a decision";
      return `Created a ${input.entity}`;
    case "assigned":
      return "Assigned a task";
    case "moved":
      if (from && to) return `Moved ${venture} from ${from} to ${to}`;
      if (input.entity === "task") return "Moved a task";
      return `Moved ${venture}`;
    case "updated":
      if (from && to) return `Moved ${venture} from ${from} to ${to}`;
      if (to) return `Moved ${venture} to ${to}`;
      if (input.entity === "task") return "Updated a task";
      return `Updated ${venture}`;
    case "completed":
      return "Completed a task";
    case "commented":
      return "Commented on a task";
    case "mentioned":
      return `Mentioned ${venture}`;
    case "decided": {
      const title = payloadString(payload, "title");
      return title ? `Logged decision ${title}` : "Logged a decision";
    }
    case "cleared": {
      const label = payloadString(payload, "label");
      return label ? `Cleared gate ${label}` : "Cleared a gate";
    }
    case "uploaded": {
      const name = payloadString(payload, "name");
      return name ? `Uploaded ${name}` : "Uploaded a doc";
    }
    case "engaged":
      return `Engaged ${venture}`;
    case "passed": {
      const company = payloadString(payload, "companyName");
      return company ? `Passed ${company}` : "Passed an application";
    }
    case "stale":
      return `${venture} went stale`;
    default:
      return `${input.verb} ${input.entity}`;
  }
}
