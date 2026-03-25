import "./globals.css";

export const metadata = {
  title: "Delale Bureau",
  description: "Planning et calculateur Delale Paysage",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}