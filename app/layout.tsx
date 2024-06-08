import '@/app/ui/global.css'
import 'animate.css/animate.min.css';
import { redditMono } from '@/app/ui/fonts';
import Navbar from './ui/navbar';
import SideNav from './ui/sidenav';
import styles from '@/app/layout.module.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${redditMono.className} antialiased flex flex-col h-screen`}>
        <div className='flex-none'><Navbar /></div>
        <div className={`flex-grow flex flex-row w-screen`}>
          <div className='flex-grow'>{children}</div>
          <SideNav />
        </div>
      </body>
    </html>
  );
}
