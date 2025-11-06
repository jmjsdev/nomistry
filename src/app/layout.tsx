import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nomistry - Générateur de noms avec vérification de disponibilité',
  description: 'Générez des noms créatifs pour votre projet et vérifiez leur disponibilité sur les domaines, marques, réseaux sociaux et app stores.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
