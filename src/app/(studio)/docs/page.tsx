import { requirePartner } from "@/lib/auth/current-user";
import { PageContainer } from "@/components/PageContainer";

export default async function DocsPage() {
  await requirePartner();
  return <PageContainer />;
}
