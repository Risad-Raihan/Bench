import { requireUser } from "@/lib/auth/current-user";
import { getProfile } from "@/lib/data/profile";
import { ProfileView } from "@/components/ProfileView";

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  if (!profile) {
    // requireUser already redirects an unknown user; this is belt-and-braces.
    return null;
  }
  return <ProfileView profile={profile} />;
}
