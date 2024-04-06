import SideBar from "@/components/SideBar";

export default function BasePlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-grow overflow-hidden">
      <SideBar />

      <div className="flex flex-grow overflow-y-auto">
        {children}
      </div>
    </div>
  );
}