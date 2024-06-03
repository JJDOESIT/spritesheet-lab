import "@/app/ui/global.css";
import { redditMono } from "@/app/ui/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${redditMono.className} antialiased`}>{children}</body>
    </html>
  );
}
