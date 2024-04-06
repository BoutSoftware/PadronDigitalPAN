import SideBar from "@/components/SideBar";

export default function BasePlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-grow overflow-hidden h-screen">
      <SideBar />

      <div className="flex flex-grow overflow-auto">
        {children}
      </div>
    </div>
  );
}