import { requirePartner } from "@/lib/auth/current-user";
import { PageContainer } from "@/components/PageContainer";

export default async function DecisionsPage() {
  await requirePartner();
  return <PageContainer />;
}
