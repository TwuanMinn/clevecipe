import dynamic from "next/dynamic";

// Dynamically import the profile content with SSR disabled
// This prevents useTheme errors during static page generation
const ProfilePageContent = dynamic(
    () => import("./ProfilePageContent"),
    { ssr: false }
);

export default function ProfilePage() {
    return <ProfilePageContent />;
}
