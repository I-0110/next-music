import '@/app/ui/global.css';
import { playfair } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${playfair.className} antialiased`}>{children}</body>
    </html>
  );
}
