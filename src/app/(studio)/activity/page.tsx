import { requirePartner } from "@/lib/auth/current-user";
import { listActivity } from "@/lib/data/activity";
import { toActivityRowView } from "@/lib/activity/view";
import { ActivityView } from "@/components/ActivityView";

export default async function ActivityPage() {
  const user = await requirePartner();
  const now = new Date();
  const rows = await listActivity(user);
  return (
    <ActivityView
      title="Activity"
      meta={`${rows.length} EVENTS`}
      items={rows.map((row) => toActivityRowView(row, now))}
    />
  );
}
