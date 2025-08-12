import NavLayout from "@/app/(nav)/layout";

export default function LiveLayout({ children }: { children: React.ReactNode }) {
  return <NavLayout>{children}</NavLayout>;
}