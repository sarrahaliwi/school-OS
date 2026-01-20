import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Police proche de Notion
import "./globals.css";
import Sidebar  from "@/src/components/shared/sidebar"; // Import de ta nouvelle sidebar

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "School OS",
  description: "Système de gestion scolaire",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} flex h-screen bg-white text-[#37352f]`}>
        {/* On place la Sidebar ici pour qu'elle soit visible sur toutes les pages */}
        <Sidebar />
        
        {/* Le contenu de tes pages s'affichera ici à droite de la sidebar */}
        <main className="flex-1 overflow-y-auto bg-white p-8">
          {children}
        </main>
      </body>
    </html>
  );
}