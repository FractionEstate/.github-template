import "./globals.css";

export const metadata = {
  title: "Cardano DApp",
  description: "A Next.js DApp on Cardano",
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
