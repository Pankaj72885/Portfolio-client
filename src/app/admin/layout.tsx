import { AdminGuard } from "@/components/admin/admin-guard";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { QueryProvider } from "@/components/providers/query-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <AdminGuard>
        <div className="min-h-screen bg-slate-950">
          <AdminSidebar />
          <main className="ml-64">{children}</main>
        </div>
      </AdminGuard>
    </QueryProvider>
  );
}
