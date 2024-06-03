import '@/app/ui/global.css'
import 'animate.css/animate.min.css';
import { redditMono } from '@/app/ui/fonts';
import Navbar from './ui/navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${redditMono.className} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
