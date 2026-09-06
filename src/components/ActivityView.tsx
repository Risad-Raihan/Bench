"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "../../design-system/components/chrome/PageHeader.jsx";
import { PageContainer } from "@/components/PageContainer";
import { ActivityFeed } from "@/components/ActivityFeed";
import type { ActivityRowView } from "@/lib/activity/view";

export function ActivityView({
  title,
  meta,
  items,
}: {
  title: string;
  meta: string;
  items: ActivityRowView[];
}) {
  const router = useRouter();
  return (
    <>
      <PageHeader title={title} meta={meta} />
      <PageContainer>
        <ActivityFeed
          items={items}
          emptyLabel="No activity yet"
          emptyHint="Partner actions across ventures will appear here."
          onSelect={(item) => {
            if (item.href) router.push(item.href);
          }}
        />
      </PageContainer>
    </>
  );
}
