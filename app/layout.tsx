import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Nextchapter — My learning roadmap',
  description:
    'A personal learning roadmap from Flutter developer to mobile/full-stack engineer who ships reliable products and integrates AI.',
  icons: {
    icon: `${process.env.GITHUB_PAGES === 'true' ? '/personal-roadmap' : ''}/favicon.svg`,
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
