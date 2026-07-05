import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import InstantWinReveal from '@/components/InstantWinReveal';
import { StoreProvider } from '@/lib/store';
import { AuthProvider } from '@/lib/auth-context';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <StoreProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartDrawer />
        <InstantWinReveal />
      </StoreProvider>
    </AuthProvider>
  );
}
