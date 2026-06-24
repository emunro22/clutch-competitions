import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: {
    default: 'Vault Competitions — Win Premium Prizes',
    template: '%s | Vault Competitions',
  },
  description:
    'Win incredible prizes from dream cars to life-changing cash. The UK\'s most trusted competition platform with verified draws and real winners. Tickets from just £0.49.',
  keywords: [
    'competitions UK',
    'win prizes UK',
    'prize competitions',
    'prize draws UK',
    'win a car UK',
    'cash prizes UK',
    'online competitions UK',
    'Vault Competitions',
  ],
  openGraph: {
    title: 'Vault Competitions — Win Premium Prizes',
    description: 'Win incredible prizes from dream cars to life-changing cash. Tickets from just £0.49.',
    siteName: 'Vault Competitions',
    locale: 'en_GB',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
