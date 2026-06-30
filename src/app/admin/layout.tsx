import Image from 'next/image';
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
              <Image src="/logo.png" alt="Clutch Competitions" width={44} height={44} className="w-11 h-11 object-contain shrink-0" />
              <span className="text-lg font-extrabold text-foreground">Admin</span>
            </div>
          </header>
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminAuth>
  );
}
