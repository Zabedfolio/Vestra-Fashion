'use client';

import { Toaster } from 'react-hot-toast';

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#111111',
          color: '#ffffff',
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: '600',
          fontSize: '13px',
          letterSpacing: '0.02em',
          borderRadius: '999px',
          padding: '12px 20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
        },
        success: {
          iconTheme: {
            primary: '#C9FA75',
            secondary: '#111111',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}
