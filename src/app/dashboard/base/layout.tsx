import BaseSideBar from "@/components/BaseSideBar";

export default function BasePlatformLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex overflow-hidden h-screen">
      <BaseSideBar />

      <div className="overflow-y-auto w-full">
        {children}
      </div>
    </div>
  );
}