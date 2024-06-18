import BaseSideBar from "@/components/BaseSideBar";

export default function BasePlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-grow overflow-hidden h-screen">
      <BaseSideBar />

      <div className="flex flex-grow overflow-auto">
        {children}
      </div>
    </div>
  );
}