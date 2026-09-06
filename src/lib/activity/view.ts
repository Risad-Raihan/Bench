import { formatFeedWhen } from "@/lib/format";
import { formatActivityText } from "@/lib/activity/text";
import { ventureColor } from "@/lib/venture-colors";

export type ActivityRowView = {
  id: string;
  who: string;
  text: string;
  when: string;
  color: string;
  href: string | null;
  unread?: boolean;
};

export type ActivityCopySource = {
  id: string;
  verb: string;
  entity: string;
  actorInitials: string | null;
  ventureName: string | null;
  ventureColor: string | null;
  ventureSlug: string | null;
  payload?: Record<string, unknown> | null;
  createdAt: Date;
};

export function toActivityRowView(
  row: ActivityCopySource,
  now: Date,
  extra?: { unread?: boolean },
): ActivityRowView {
  return {
    id: row.id,
    who: row.actorInitials ?? "—",
    text: formatActivityText({
      verb: row.verb,
      entity: row.entity,
      ventureName: row.ventureName,
      payload: row.payload ?? null,
    }),
    when: formatFeedWhen(row.createdAt, now),
    color: extra?.unread ? "var(--amber)" : ventureColor(row.ventureColor),
    href: row.ventureSlug ? `/v/${row.ventureSlug}` : null,
    unread: extra?.unread,
  };
}
