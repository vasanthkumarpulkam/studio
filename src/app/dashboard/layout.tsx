export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
        {children}
      </main>
  );
}
