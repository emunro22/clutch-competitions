'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cc-cookie-consent';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[60] bg-surface border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-muted flex-1 text-center sm:text-left">
          We use essential cookies to keep you signed in, remember your cart, and process
          payments securely. See our{' '}
          <Link href="/cookies" className="text-primary hover:underline font-semibold">
            Cookie Policy
          </Link>{' '}
          for details.
        </p>
        <button
          onClick={accept}
          className="shrink-0 px-6 py-2.5 bg-primary hover:bg-primary-light text-background font-bold rounded-xl transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
