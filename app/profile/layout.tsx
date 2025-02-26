import BottomNavigation from "@/components/BottomNavigation";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <BottomNavigation />
    </>
  );
}
