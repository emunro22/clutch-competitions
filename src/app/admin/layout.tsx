import AdminSidebar from '@/components/AdminSidebar';
import AdminAuth from '@/components/AdminAuth';

export const metadata = {
  title: 'Admin Portal',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuth>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 lg:ml-0">
          <header className="lg:hidden bg-surface border-b border-border px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center font-black text-background text-sm">
                VC
              </div>
              <span className="text-lg font-extrabold text-foreground">Admin</span>
            </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminAuth>
  );
}
