import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { QueryProvider } from "@/components/providers/query-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-slate-950">
        <AdminSidebar />
        <main className="ml-64">{children}</main>
      </div>
    </QueryProvider>
  );
}
