import SideBar from "@/components/SideBar";

export default function BasePlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1">
      <SideBar />

      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}